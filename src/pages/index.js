import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommonBanner from "@/components/ui/Homebanner";
import ClientReviews from "@/components/ui/clientReview";
import Milestones from "@/components/ui/ourMilestone";
import BrandsWeRepair from "@/components/ui/brandsWithWe";
import BookService from "../components/ui/book-ro-service"


export default function Home() {
  return (
    <>
    <Navbar/>
    <CommonBanner/>
     <BookService/>
     <ClientReviews/>
     <Milestones/>
     <BrandsWeRepair/>
    <Footer/>
    </>
  );
}
