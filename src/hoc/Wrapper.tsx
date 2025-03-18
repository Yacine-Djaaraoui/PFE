import Header from "@/components/ui/Header";
import Sidebar from "@/pages/home/sidebar";
import React, { useEffect } from "react";

const Wrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  // Return a functional component instead of a callback
  const WrappedWithLayout: React.FC<P> = (props) => {
    // Scroll to the top whenever the component is mounted or updated
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
      <>
        <Sidebar />
        
        <div className="ml-[17%]"> 
        <Header />
          <WrappedComponent  {...props} />
          </div>
      </>
    );
  };

  return WrappedWithLayout;
};

export default Wrapper;
