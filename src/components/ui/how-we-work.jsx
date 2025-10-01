import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import WhatWeWorkMobile from "../../../public/images/diagram-flow.png";
import WhatWeWorkDesktop from "../../../public/images/steps-flow.png"; // Add your desktop image

const HowWeWorks = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return (
        <section className="max-w-6xl mx-auto my-12 px-4 py-8 bg-white rounded-xl shadow border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 text-center">
                How We Work
            </h2>
            <p className="text-gray-600 text-center mb-8">
                Our process is simple and transparent. Here’s how we deliver the best RO
                water purifier services to your doorstep.
            </p>
            <div className="flex justify-center">
                <Image
                    src={isMobile ? WhatWeWorkMobile : WhatWeWorkDesktop}
                    alt="How we work"
                    width={isMobile ? 400 : 900}
                    height={isMobile ? 250 : 400}
                    className="rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
};

export default HowWeWorks;