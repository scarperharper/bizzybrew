import { useNavigation } from "react-router";
import { Button } from "../ui/button";

export const SubmitButton = ({
  name = "submit",
  value = "submit",
  submitText = "Submit",
  submittingText = "Submitting",
}: {
  name?: string;
  value?: string;
  submitText?: string;
  submittingText?: string;
}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  return (
    <Button
      type="submit"
      name={name}
      value={value}
      disabled={isSubmitting}
      className={isSubmitting ? "disabled-btn" : "btn"}
    >
      {isSubmitting ? submittingText : submitText}
    </Button>
  );
};
