import { Product } from "@/entities/product";
import Star from "@/shared/assets/img/start.svg";
import { Flex } from "antd";
import Image from "next/image";
import styles from "./ProductList.module.scss";

interface ProductListInterface {
  products: Product[];
}
const ProductList = ({ products }: ProductListInterface) => {
  //think about adaptive layout
  return (
    <div className={styles.products}>
      {products.map((product) => (
        <Flex key={product.id} className={styles.product} vertical>
          <div className={styles.img}>
            {product.imgUrls?.[0] ? (
              <Image fill className={styles.img} src={product.imgUrls?.[0]} alt={"product image"} />
            ) : (
              <>No image</>
            )}
          </div>
          <Flex vertical className={styles.body}>
            <p className={styles.title}>{product.name}</p>
            <Flex className={styles.brand}>
              <p>{product.brand.name}</p>
              <p className={styles.rate}>
                {product.rate} <Image src={Star} alt="start icon" width={18} height={18} />
              </p>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </div>
  );
};

export default ProductList;
