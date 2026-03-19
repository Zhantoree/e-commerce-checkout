import SearchBar from "@/app/(mainPage)/(ui)/product-list/preview";
import Cart from "@/shared/assets/img/cart.svg";
import Heart from "@/shared/assets/img/heart.svg";
import Logo from "@/shared/assets/img/logo.svg";
import Profile from "@/shared/assets/img/profile_sample.jpg";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

const user = {
  avatarUrl: Profile,
  firstName: "Anne",
  lastName: "Doe",
};
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Image src={Logo} alt="logo" width={57} />
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <Link href={"#"}>Men</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={"#"}>Women</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={"#"}>Kids</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={"#"}>Shop</Link>
          </li>
          <li className={styles.menuItem}>
            <Link href={"#"}>Contact us</Link>
          </li>
        </ul>
        <SearchBar />
        <div className={styles.personal}>
          <Link href={"#"}>
            <Image src={Heart} alt="Heart" />
          </Link>
          <Link href={"/cart"}>
            <Image src={Cart} alt="Cart" />
          </Link>
          <div className={styles.profile}>
            <Image className={styles.avatar} src={user.avatarUrl} alt="profile_photo" />
            <p className={styles.name}>
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
