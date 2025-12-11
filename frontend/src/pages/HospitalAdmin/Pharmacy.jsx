import React from "react";
import { Card, CardBody } from "@chakra-ui/react";

const Pharmacy = () => {
  return (
    <div className="p-6">
      <Card>
        <CardBody>
          <h1 className="text-2xl font-bold mb-4">Pharmacy</h1>

          <p className="text-gray-600">
            Pharmacy module placeholder. You can add drug inventory, stock
            management, and prescriptions here.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Pharmacy;
