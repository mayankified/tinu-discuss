import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col justify-center h-[100vh] items-center ">
      <p className="h1-bold mb-4 font-spaceGrotesk text-dark-100 dark:text-light-900 ">
        Tinu <span className="text-primary-500">Discuss</span>
      </p>
      {children}
    </div>
  );
};

export default Layout;
