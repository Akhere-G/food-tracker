# Deploying FoodTracker to Google Cloud Run

The root `Dockerfile` produces two Linux images:

- the default target is the small, non-root Next.js standalone service;
- the `migrator` target runs Drizzle migrations as a Cloud Run Job.

`cloudbuild.yaml` builds and pushes both targets, runs the migration job, and
only then deploys the application service.

## One-time Google Cloud setup

Set values for your project. The defaults use London (`europe-west2`), but all
names and locations can be overridden through Cloud Build substitutions.

```bash
export GCP_PROJECT="your-project-id"
export GCP_REGION="europe-west2"
export AR_REPOSITORY="food-tracker"
export CLOUD_RUN_SERVICE="food-tracker"
export RUNTIME_SERVICE_ACCOUNT="foodtracker-runner@${GCP_PROJECT}.iam.gserviceaccount.com"
export CLOUD_SQL_INSTANCE="${GCP_PROJECT}:${GCP_REGION}:your-instance"

gcloud config set project "$GCP_PROJECT"
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com

gcloud artifacts repositories create "$AR_REPOSITORY" \
  --repository-format=docker \
  --location="$GCP_REGION"

gcloud iam service-accounts create foodtracker-runner \
  --display-name="FoodTracker Cloud Run"
```

Grant the runtime identity database and secret access:

```bash
gcloud projects add-iam-policy-binding "$GCP_PROJECT" \
  --member="serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding "$GCP_PROJECT" \
  --member="serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

Create the runtime secrets. URL-encode reserved characters in the database
username and password.

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/${CLOUD_SQL_INSTANCE}"

printf '%s' "$DATABASE_URL" | gcloud secrets create foodtracker-database-url \
  --data-file=-
openssl rand -base64 32 | gcloud secrets create foodtracker-auth-secret \
  --data-file=-
```

If a secret already exists, add a new version with `gcloud secrets versions
add SECRET_NAME --data-file=-` instead.

## Cloud Build permissions

The Cloud Build service account needs these roles:

- Artifact Registry Writer
- Cloud Run Admin
- Service Account User on `foodtracker-runner`

Configure them through IAM or a dedicated Cloud Build service account. Keep
deployment credentials in IAM and Secret Manager, never in this repository.

## Deploy

The first deploy discovers the stable Cloud Run URL and stores it as
`BETTER_AUTH_URL`. Pass `_APP_URL` when using a custom domain.

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions="_REGION=${GCP_REGION},_REPOSITORY=${AR_REPOSITORY},_SERVICE=${CLOUD_RUN_SERVICE},_MIGRATION_JOB=${CLOUD_RUN_SERVICE}-migrate,_RUNTIME_SERVICE_ACCOUNT=${RUNTIME_SERVICE_ACCOUNT},_CLOUD_SQL_INSTANCE=${CLOUD_SQL_INSTANCE}"
```

For a custom domain, append `_APP_URL=https://your-domain.example` to the
substitutions. Use the same substitutions on a Cloud Build trigger for
continuous deployment.

## Required production configuration

- `DATABASE_URL` and `BETTER_AUTH_SECRET` come from Secret Manager.
- `BETTER_AUTH_URL` is set to the public application origin.
- Cloud SQL is mounted at `/cloudsql/INSTANCE_CONNECTION_NAME`.
- The service listens on Cloud Run's injected `PORT` through `0.0.0.0`.
- Migrations complete successfully before a new service revision is deployed.
