import { describe, expect, it } from "vitest";
import { registerSchema } from "./schema";

const validRegistration = {
  name: "Alex Morgan",
  email: "alex@example.com",
  password: "Foodtracker1!",
  repeatPassword: "Foodtracker1!",
};

describe("registerSchema", () => {
  it("accepts a password containing upper, lower and numeric characters", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it("rejects a password without a number", () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: "Foodtracker!",
      repeatPassword: "Foodtracker!",
    });

    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ message: "Password must contain a number." }),
    );
  });
});
