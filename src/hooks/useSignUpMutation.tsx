import { useMutation } from "@tanstack/react-query";
import { SignUpCredentials } from "./useSignUpForm";

const fetchSignUp = async (values: SignUpCredentials) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  const data = await response.json();
  return data;
};

export const useSignUpMutation = () => {
  const mutation = useMutation({
    mutationFn: (values: SignUpCredentials) => fetchSignUp(values),
  })
  return mutation;
};
