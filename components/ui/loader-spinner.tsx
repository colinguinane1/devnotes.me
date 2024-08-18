import { Oval } from "react-loader-spinner";

export default function LoadingSpinner() {
  return (
    <Oval
      visible={true}
      height="20"
      width="30"
      color="#000000"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
