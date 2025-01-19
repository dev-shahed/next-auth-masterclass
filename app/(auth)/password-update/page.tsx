import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import FormElement from "@/app/(auth)/password-update";
import { db } from "@/db/drizzle";
import { passwordResetTokensTable } from "@/db/passwordResetTokens";
import { eq } from "drizzle-orm";

export default async function passwordUpdate({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = await searchParams;
  //Check token is valid or not via an util function
  let tokenIsValid = false;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.token, token));

    const now = Date.now();

    if (
      !!passwordResetToken?.tokenExpiry &&
      now < passwordResetToken.tokenExpiry.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {tokenIsValid
              ? "Update you password"
              : "Your password update link is invalid or has been expired."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <FormElement token={token ?? ""} />
          ) : (
            <Link className="underline text-blue-500" href={"/password-reset"}>
              Request for Reset Password
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
