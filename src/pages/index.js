import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommonBanner from "@/components/ui/Homebanner";
import ClientReviews from "@/components/ui/clientReview";
import Milestones from "@/components/ui/ourMilestone";
import BrandsWeRepair from "@/components/ui/brandsWithWe";
import BookService from "../components/ui/book-ro-service"
import WaterPurifierServicePage from "@/components/ui/homePageContent";
import BrandListSection from "@/components/ui/ourBrandServe";
import FaqSectionRO from "@/components/ui/customerReview";


export default function Home() {
  return (
<div className="bg-white dark:bg-white text-gray-700 dark:text-gray-800 font-sans min-h-screen">
    <Navbar/>
    <CommonBanner/>
     <BookService/>
     <ClientReviews/>
     <Milestones/>
     {/* <BrandsWeRepair/> */}
     <WaterPurifierServicePage/>
     <FaqSectionRO/>
     <BrandListSection/>
    <Footer/>
    </div>
  );
}
