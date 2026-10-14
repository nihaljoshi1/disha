import { logoLight, logoDark } from '../assets/logoData';

export default function Logo({ className = 'logo' }) {
  return (
    <>
      <img src={logoLight} alt="Disha" className="logo-img logo-img-light" />
      <img src={logoDark} alt="Disha" className="logo-img logo-img-dark" />
    </>
  );
}