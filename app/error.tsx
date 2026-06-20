"use client";

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";
interface ErrorStateProps {
   error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
   useEffect(() => {
      console.error(error);
   }, [error]);
   return <EmptyState title="Có lỗi xảy ra!" subTitle="Xin vui lòng thử lại sau" />;
};

export default ErrorState;
