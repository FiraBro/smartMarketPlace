import Lottie from "lottie-react";
import loadingAnim from "../../assets/animations/loading.json";

export default function LottieLoader() {
  return (
    <div className="flex justify-center items-center h-64">
      <Lottie animationData={loadingAnim} loop className="w-40" />
    </div>
  );
}
