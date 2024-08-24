import {faker} from '@faker-js/faker';

export interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export const generateData = (numRecords: number): UserData[] => {
    return Array.from({ length: numRecords }, () => ({
      id: faker.string.uuid(),  
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: `${faker.location.streetAddress()}`,
    }));
  };