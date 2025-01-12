import { z } from "zod";

// sign up form schema

const SignupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    fullName: z.string().min(5, 'Full name must be at least 5 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    address: z.string().optional(),
    phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid phone number'),
});


type SignupFormData = z.infer<typeof SignupSchema>;
export {SignupSchema}
export type {SignupFormData
    
}
// login form schema 
const LoginSchema = z.object({

    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),

});
type LoginFormData = z.infer<typeof LoginSchema>;
export { LoginSchema }
export type { LoginFormData }

// address form schema 
const AddressSchema = z.object({
    fullName: z
        .string()
        .nonempty("Full name is required"), // Custom error message for empty full name
    Province: z.enum(
        [
            "Punjab",
            "Sindh",
            "Khyber Pakhtunkhwa",
            "Balochistan",
            "Islamabad Capital Territory",
            "Gilgit-Baltistan",
            "Azad Jammu and Kashmir",
        ],
        {
            errorMap: () => ({ message: "Invalid province. Please select a valid province." }),
        }
    ), // Province must be one of the specified values
    City: z
        .string()
        .nonempty("City is required"), // Custom error for City
    phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"), // Validation for phone with error message
    Building: z
        .string()
        .optional()
        .or(z.literal("").optional()), // Optional Building field
    HouseNo: z
        .string()
        .nonempty("House or office number is required"), // Required HouseNo field with message
    Floor: z
        .string()
        .optional(), // Optional Floor
    Street: z
        .string()
        .optional(), // Optional Street
});
type AddressFormData = z.infer<typeof AddressSchema>;

export { AddressSchema };
export type { AddressFormData };
