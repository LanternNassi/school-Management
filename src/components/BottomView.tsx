import * as React from "react";
import { Drawer } from "@mui/material";
import Custom_Axios from "./CustomAxios";
import CircularProgress from "@mui/material/CircularProgress";
import NormalTable from "./Tables/NormalTable";

import ITableHeaderSchema from "@/schema/ITableHeaders";

import IUserGroupSchema from "@/schema/IUserGroup";
import { IUserSchema } from "@/schema/IUsers";
import { IContactSchema } from "@/schema/IContact";
import { IClassSchema } from "@/schema/IClassSchema";
import { IStreamSchema } from "@/schema/IStreamSchema";

interface Props {
  open: boolean;
  onToggleDrawer: (e: boolean) => void;
  onSelection: (e: string[]) => void;
  viewheaders: ITableHeaderSchema[];
  getModel: (modelHook: (e: any) => void) => void;
}

export default function BottomView({
  open,
  onToggleDrawer,
  onSelection,
  viewheaders,
  getModel,
}: Props) {
  const [models, setmodels] = React.useState<
    IUserSchema | IContactSchema | IClassSchema | IStreamSchema | null
  >(null);
  const [headers, setHeaders] =
    React.useState<ITableHeaderSchema[]>(viewheaders);

  React.useEffect(() => {
    getModel(setmodels);
  }, []);

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => {
          onToggleDrawer(false);
        }}
      >
        {models != null ? (
          <div style={{ width: "100vw", paddingTop: "20px" }}>
            <NormalTable
              heading={"Select"}
              OnSelection={onSelection}
              headers={headers}
              table_rows={models}
            />
          </div>
        ) : (
          <div style={{ display: "flex" }}>
            <CircularProgress />
          </div>
        )}
      </Drawer>
    </>
  );
}
