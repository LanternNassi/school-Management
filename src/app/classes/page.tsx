/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { ReactNode } from "react";
import {
  Button,
  Divider,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./page.css";

import { IUserSchema, IUserPostSchema } from "@/schema/IUsers";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import IUserGroupSchema from "@/schema/IUserGroup";
import Edit from "@/components/Edit";

import { IClassSchema , IPostClassSchema } from "@/schema/IClassSchema";

import Custom_Axios from "@/components/CustomAxios";
import CustomSearch from "@/components/CustomSearch";
import CircularProgress from "@mui/material/CircularProgress";
import NormalTable from "../../components/Tables/NormalTable.jsx";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FeedBack, FeedBackProps } from "@/components/FeedBack";
import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import { useRouter } from "next/navigation";


export default function page() {
  const [classes, setclasses] = React.useState<IClassSchema[] | null>(null);
  const [active_class, setactive_class] = React.useState<IClassSchema | null>(
    null
  );
  const [selected_classes, setselectedclasses] = React.useState<string[]>([]);
  const [headers, setHeaders] = React.useState<ITableHeaderSchema[] | null>(
    null
  );
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);
  const [groups, setgroups] = React.useState<IUserGroupSchema[]>([]);

  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);

  const router = useRouter();

  const FetchClasses = (): void => {
    Custom_Axios()
      .get("/Classes")
      .then((response) => {
        if (response.status == 200) {
          setclasses(response.data);
        }
      });
  };

  const FetchClassById = (id : string , OnSuccess : (data : IClassSchema) => void):void => {
    Custom_Axios()
        .get(`/Classes/${id}`)
        .then((response)=>{
            if (response.status == 200){
                OnSuccess(response.data)
            }
        })
  }


  const createHeaders = (): void => {
    
    const headers: ITableHeaderSchema[] = [
      {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Class",
        alignment: "left",
        resolver: (row: IClassSchema) => row.name,
      },
      {
        id: "more_info",
        numeric: false,
        disablePadding: true,
        label: "More Info",
        alignment: "left",
        resolver: (row: IClassSchema) => row.more_info,
      },
      {
        id: "streams",
        numeric: true,
        disablePadding: true,
        label: "Streams",
        alignment: "left",
        resolver: (row: IClassSchema) => row.StreamCount,
      },
      {
        id: "addedAt",
        numeric: false,
        disablePadding: true,
        label: "Date Added",
        alignment: "left",
        resolver: (row: IUserSchema) => toDDMMYYYY(row.addedAt),
      },
      {
        id: "updatedAt",
        numeric: false,
        disablePadding: true,
        label: "Date updated",
        alignment: "left",
        resolver: (row: IUserSchema) => toDDMMYYYY(row.updatedAt),
      },
    ];

    setHeaders(headers);
  };

  const CreateClass = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const data: IPostClassSchema = {
      name : formData.get('name') as string,
      more_info : formData.get('more_info') as string,
    };

    Custom_Axios()
      .post("/Classes", data)
      .then((response) => {
        if (response.status === 201) {
          setFeedback({
            status: "success",
            message: `class created successfully`,
            outlined: false,
            open: true,
          });
          setsubmitting(false);
          setedit(false);

          setTimeout(() => {
            setFeedback(null);
          }, 4000);

          setactive_class(null);
        }
      });
  };

  const UpdateClass = (event: React.FormEvent<HTMLFormElement>) => {};

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const Fields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_class ? active_class.id : ""}
          disabled
          name="id"
          label="Class id"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_class ? active_class.name : ""}
          name="name"
          label="Class"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_class ? active_class.more_info : ""}
          name="more_info"
          label="More Information"
          variant="outlined"
          multiline
          rows={4}
        />
        
        <LoadingButton
          type="submit"
          sx={{ width: "25vw", height: "8vh" }}
          variant="contained"
          tabIndex={-1}
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon fontSize="large" />}
        >
          <span>Submit</span>
        </LoadingButton>
      </>
    );
  };

  const OnSelection = (e: string[]) => {
    setselectedclasses(e);
  };

  React.useEffect(() => {
    FetchClasses();
    createHeaders();
  }, [submitting]);

  return (
    <>
      <FeedBack
        open={feedBack ? feedBack.open : false}
        message={feedBack ? feedBack.message : ""}
        outlined={feedBack ? feedBack.outlined : false}
        status={feedBack ? feedBack.status : "error"}
      />
      <div className="ActionsRegionClass">
        <div className="ActionsClass">
          <Button
            variant="contained"
            onClick={() => {
              setactive_class(null);
              setedit(true);
            }}
            disabled={selected_classes.length > 0}
            startIcon={<AddOutlinedIcon />}
          >
            Add
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              FetchClassById(selected_classes[0], (data) => {
                setactive_class(data);
                setedit(true);
              });
            }}
            disabled={!(selected_classes.length > 0)}
            startIcon={<SyncAltOutlinedIcon />}
          >
            Update
          </Button>

          <Button
            variant="contained"
            disabled={!(selected_classes.length > 0)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>

        </div>
      </div>

      <Divider style={{ width: "80vw" }} textAlign="center">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "14vw",
          }}
        >
          <Typography sx={{ fontSize: 14 }}>{"Current Users"}</Typography>
        </div>
      </Divider>

      <div className={"SearchClass"}>
        <CustomSearch
          placeholder={"Search Class"}
          icon_1={<SearchIcon />}
          icon_2={<MenuIcon />}
          value={""}
          onChange={(e) => {}}
        />
      </div>

      {classes != null ? (
        <div style={{ width: "90vw", paddingTop: "20px" }}>
          <NormalTable
            heading={"Users"}
            OnSelection={OnSelection}
            headers={headers}
            table_rows={classes}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <CircularProgress />
        </div>
      )}

      <Edit
        open={edit}
        Heading={"ADD CLASS"}
        onSubmit={CreateClass}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </>
  );
}
