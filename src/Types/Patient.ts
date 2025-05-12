import Ordonnance from "./Ordonnance";


type Patient = {
    id: number;
    noms: string;
    sexe: string; 
    phone: string;
    email: string;
    password: string;
    adresse: string;
    age: number;
    Ordonnance:Ordonnance[]
  };
  export default Patient;