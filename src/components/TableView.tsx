import { Table } from "flowbite-react";

export interface IPassengerInfo {
  name: string;
  pickUpPointOrder: number;
  tripDuration: string;
  pickUpPoint: {
    lat: number;
    lng: number;
  };
}

interface ITableViewProps {
  Passengers: IPassengerInfo[];
}

export const TableView: React.FC<ITableViewProps> = ({ Passengers }) => {
  return (
    <Table className="mt-5" striped={true}>
      <Table.Head>
        <Table.HeadCell>Yolcu İsmi</Table.HeadCell>
        <Table.HeadCell>Sırası</Table.HeadCell>
        <Table.HeadCell>Yolculuk Süresi</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {Passengers.map((passenger, index) => {
          return (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell>{passenger.name}</Table.Cell>
              <Table.Cell>{passenger.pickUpPointOrder}</Table.Cell>
              <Table.Cell>{passenger.tripDuration}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};
