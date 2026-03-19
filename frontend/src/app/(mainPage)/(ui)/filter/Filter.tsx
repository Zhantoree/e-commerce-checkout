"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Button, Checkbox, Collapse, Divider, Flex, Tag, Typography } from "antd";
import { motion } from "motion/react";
import { Fragment, useState } from "react";
import { v7 as uid } from "uuid";
import { filterFieldToTitleMap } from "../../(lib)/filter.constants";
import { FilterData, FilterTypes } from "../../(model)/types";
import { defaultFilterValues, useFilter } from "../../(providers)/FilterProvider";
import styles from "./Filter.module.scss";

// Think about persistence
const filterData: FilterData = {
  prices: [
    { id: uid(), name: "150$ to 200$", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "200$ to 500$", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "500$ to 700$", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "700$ to 1000$", quantity: Math.floor(Math.random() * 100) },
  ],
  brands: [
    { id: uid(), name: "Tokyo Talkies", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Roadster", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "High Star", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Miss Chase", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Voxati", quantity: Math.floor(Math.random() * 100) },
  ],
  colors: [
    { id: uid(), name: "Blue", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Green", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Yellow", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "Brown", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "White", quantity: Math.floor(Math.random() * 100) },
  ],
  discounts: [
    { id: uid(), name: "10% and above", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "20% and above", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "30% and above", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "40% and above", quantity: Math.floor(Math.random() * 100) },
    { id: uid(), name: "50% and above", quantity: Math.floor(Math.random() * 100) },
  ],
};

function Filter() {
  // Think about currency affect on filter
  const { filter, setFilter, showFilter, toggleFilter } = useFilter();
  const [expandFilterKeys, setExpandFilterKeys] = useState<FilterTypes[]>([]);
  const [customPrice, setCustomPrice] = useState<[number, number]>([0, 1000]);
  const toggleTag = (type: FilterTypes, filterItem: { id: string }) => {
    const isExist = filter[type].find((b) => b.id === filterItem.id);
    setFilter((prev) => ({
      ...prev,
      [type]: isExist
        ? filter[type].filter((item) => item.id !== filterItem.id)
        : [...filter[type], filterItem],
    }));
  };

  const resetFilter = () => {
    setFilter(defaultFilterValues);
  };

  const onExpandFilter = (type: FilterTypes) => {
    setExpandFilterKeys((prev) => [...prev, type]);
  };

  const maxFilterItems = 3;

  return (
    <motion.aside
      initial={false}
      animate={{
        width: showFilter ? "24%" : 0,
        opacity: showFilter ? 1 : 0,
        marginRight: showFilter ? "43px" : 0,
        padding: showFilter ? "22px" : 0,
      }}
      layout
      transition={{ duration: 0.2 }}
      className={styles.filter}
    >
      <div className={styles.titleBlock}>
        <h3 className={styles.title}>Filters</h3>
        <Button ghost className={styles.clear} onClick={resetFilter}>
          Clear all
        </Button>
      </div>
      <div className={styles.tagBlock}>
        {Object.entries(filter).map(([type, items]) =>
          items.map((item) => (
            <Tag key={item.id} className={styles.tagItem}>
              <CloseOutlined onClick={() => toggleTag(type as FilterTypes, item)} /> {item.name}
            </Tag>
          )),
        )}
      </div>

      <Collapse
        bordered={false}
        ghost
        expandIconPlacement={"end"}
        rootClassName={styles.collapse}
        items={Object.entries(filterData).map(([type, items], index) => ({
          label: (
            <Typography.Paragraph className={styles.itemLabel}>
              {filterFieldToTitleMap[type as FilterTypes]}
            </Typography.Paragraph>
          ),
          children: (
            <>
              {items.map((item, index) => {
                const isExpanded = !!expandFilterKeys.find((key) => key === type);
                const restItemsLength = filterData?.[type as FilterTypes].length - index;

                if (!isExpanded && index === maxFilterItems && restItemsLength) {
                  return (
                    <Button key={item.id} ghost onClick={() => onExpandFilter(type as FilterTypes)}>
                      <Typography.Text>+ {restItemsLength} more</Typography.Text>
                    </Button>
                  );
                }
                if (!isExpanded && index > maxFilterItems)
                  return <Fragment key={item.id}></Fragment>;

                return (
                  <Flex
                    key={item.id}
                    gap={10}
                    align="center"
                    className={styles.menuItem}
                    onClick={() => toggleTag(type as FilterTypes, item)}
                  >
                    <Checkbox
                      checked={!!filter?.[type as FilterTypes].find((b) => b.id === item.id)}
                    />
                    <Typography.Text className={styles.itemText}>
                      {item.name} <Typography.Text>({item.quantity})</Typography.Text>
                    </Typography.Text>
                  </Flex>
                );
              })}
              <Divider size="small" />
            </>
          ),
        }))}
      />
    </motion.aside>
  );
}

export default Filter;
