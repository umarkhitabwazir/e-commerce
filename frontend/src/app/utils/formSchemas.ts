import { z } from "zod";

// sign up form schema

const SignupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),

});


type SignupFormData = z.infer<typeof SignupSchema>;
export { SignupSchema }
export type {
    SignupFormData

}
// login form schema 
const LoginSchema = z.object({

    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),

});
type LoginFormData = z.infer<typeof LoginSchema>;
export { LoginSchema }
export type { LoginFormData }

// creatProduct form schema
const CreateProductSchema = z.object({
    productImg: z
        .custom((val) => val instanceof FileList && val.length > 0, {
            message: 'Product image is required and must be a file',
        }),
    categoryName: z.enum([
        "Perfume",
        "Smart Watch",
        "Fashion",
        "Beauty & Skincare",
        "Electronics",
        "Mobile Phones",
        "Laptops",
        "Tablets",
        "Desktop Computers",
        "Computer Accessories",
        "Cameras",
        "Headphones",
        "Speakers",
        "Home Appliances",
        "Kitchen Appliances",
        "Refrigerators",
        "Washing Machines",
        "Air Conditioners",
        "Furniture",
        "Living Room Furniture",
        "Bedroom Furniture",
        "Office Furniture",
        "Clothing Men",
        "Clothing Women",
        "Clothing Kids",
        "Shoes Men",
        "Shoes Women",
        "Shoes Kids",
        "Bags & Luggage",
        "Watches",
        "Jewelry",
        "Books",
        "Stationery",
        "Sports Equipment",
        "Fitness & Gym",
        "Toys",
        "Baby Products",
        "Health Care",
        "Pharmacy",
        "Groceries",
        "Snacks & Beverages",
        "Pet Supplies",
        "Automobile Accessories",
        "Motorbikes",
        "Car Accessories",
        "Gardening",
        "Home Decor",
        "Lighting",
        "Tools & Hardware",
        "Construction Materials",
        "Musical Instruments",
        "Gaming Consoles",
        "Video Games",
        "Software",
        "Streaming Devices",
        "Smart Home Devices",
        "Medical Equipment",
        "Safety & Security",
        "Gift Items",
        "Seasonal Items",
        "Arts & Crafts"
    ]),
    title: z.string().min(1, 'Title is required'),
    price: z.coerce.number().min(1, { message: 'price is required' }),
    description: z.string().min(1, 'Description is required'),
    countInStock: z.coerce.number().min(1, { message: 'Stock count is required' }),
    brand: z.string().min(1, 'Brand is required'),
});
type CreateProductFormData = z.infer<typeof CreateProductSchema>
export { CreateProductSchema }
export type { CreateProductFormData }

// address form schema 
const AddressSchema = z.object({
   
    Province: z.enum(
       [
          "Lahore",
  "Faisalabad",
  "Multan",
  "Rawalpindi",
  "Gujranwala",
  "Sialkot",
   "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu and Kashmir"
       ],
        {
            errorMap: () => ({ message: "Invalid province. Please select a valid province." }),
        }
    ), // Province must be one of the specified values
    City: z
        .string()
        .nonempty("City is required"), // Custom error for City
   
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
  .regex(/^[A-Za-z0-9\s\/-]{3,}$/, "Invalid street format. Example: G16/3 Street 48"),

});
type AddressFormData = z.infer<typeof AddressSchema>;

export { AddressSchema };
export type { AddressFormData };
