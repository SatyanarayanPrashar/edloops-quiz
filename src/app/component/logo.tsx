import { cn } from "../lib/utils";

interface LogoProps {
  classname?: string;
  theme?: string;
}

export const Logo = ({ classname, theme }: LogoProps) => {
  return (
    <div className={cn("flex justify-center items-center", classname)}>
        <img src={"/logo_new.png"} alt="" className='h-[1.2rem] shrink-0 rounded-full invert brightness-0'/>
        {/* <div className='h-10 w-[1px] border-l-[1px] mx-5'></div> */}
        <div className={cn("text-center text-white text-[20px] ml-2", theme==="light" && "text-white")}>
            Edloops
        </div>
    </div>
  );
};