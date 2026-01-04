import { Outlet } from "react-router";

const Sales = () => {
  return (
    <div className="flex flex-row flex-wrap py-4">
      <main role="main" className="w-full">
        <div className="hidden flex-col md:flex">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default Sales;
