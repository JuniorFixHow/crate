export function getPasswordValidationMessage(): string {
    return "Password must be at least 8 characters long, include at least one uppercase letter, and at least one number.";
}
  
export function isPasswordValid(password: string): boolean {

    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}
  
