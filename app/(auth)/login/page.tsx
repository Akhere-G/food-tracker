import LoginForm from "@/app/features/auth/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div>
      <div className="container p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="title">Login</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
