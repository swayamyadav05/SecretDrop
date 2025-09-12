import { MessageCircle } from "lucide-react";
import React from "react";

const Brand = () => {
  return (
    <div className="flex items-center space-x-3">
      <MessageCircle className="h-8 w-8 text-primary/80" />
      <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        SecretDrop
      </h1>
    </div>
  );
};

export default Brand;
