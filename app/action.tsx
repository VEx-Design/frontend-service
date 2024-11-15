"use server";

export async function submitForm(formData: FormData) {
  console.log(formData.get("email")); // get field that name in input
  // so data will appear in server
}
