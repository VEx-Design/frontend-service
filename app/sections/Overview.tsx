import Typewriter from "../components/TypeWritter";

export default function Overview() {
  return (
    <div
      className="flex items-center justify-center w-full h-screen absolute top-0"
      style={{
        backgroundImage: `url(/images/Overview.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[900px] text-center">
        <div className="md:text-6xl sm:text-5xl text-4xl font-bold md:mb-4 sm:mb-3 mb-2 text-white">
          <Typewriter text={"Welcome to VexDesign"} speed={150} delay={2000} />
        </div>
        <p className="md:text-lg sm:text-base text-sm text-gray-400 px-4 md:px-0">
          where you can explore interactive science experiment simulations. Our
          platform offers hands-on virtual experiments across various scientific
          fields, making learning science engaging and fun. Start your
          scientific journey with us today!
        </p>
      </div>
    </div>
  );
}
