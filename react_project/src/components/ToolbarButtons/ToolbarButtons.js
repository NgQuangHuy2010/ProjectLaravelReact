import React from 'react';
import { Button } from 'primereact/button';
import styles from "./ToolbarButton.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ToolbarButtons = ({
  selectedProducts,
  confirmDeleteSelected,
  openNew,
  exportCSV,
  deleteLabel = "", // Empty default label
  createLabel = "", // Empty default label
  exportLabel = "", // Empty default label for export
}) => {

  return (
    <div className="flex flex-wrap gap-2">
      {/* Only show the Delete button if a record is selected */}
      {selectedProducts.length > 0 && (
        <Button
          className={cx("config-button", "fw-normal")}
          label={deleteLabel}
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
        />
      )}
      <Button
        className={cx("config-button", "fw-normal")}
        label={createLabel}
        icon="pi pi-plus"
        severity="success"
        onClick={openNew}
      />

      {exportCSV && (
        <Button
          className={cx("config-button", "p-button-help")}
          label={exportLabel}
          icon="pi pi-upload"
          onClick={exportCSV}
        />
      )}
    </div>
  );
};

export default ToolbarButtons;
