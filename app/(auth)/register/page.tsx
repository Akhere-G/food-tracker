import RegisterForm from "@/app/features/auth/components/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div>
      <div className="container p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="title">Register</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
