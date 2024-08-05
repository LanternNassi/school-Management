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

import { IClassSchema, IPostClassSchema } from "@/schema/IClassSchema";

import { IStreamSchema, IPostStreamSchema } from "@/schema/IStreamSchema";
import Alert from "@mui/material/Alert";
import Custom_Axios from "@/components/CustomAxios";
import CustomSearch from "@/components/CustomSearch";
import CircularProgress from "@mui/material/CircularProgress";
import NormalTable from "../../components/Tables/NormalTable.jsx";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FeedBack, FeedBackProps } from "@/components/FeedBack";
import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import { useRouter } from "next/navigation";
import BottomView from "@/components/BottomView";

export default function page() {
  const [streams, setstreams] = React.useState<IStreamSchema[] | null>(null);
  const [active_stream, setactive_stream] =
    React.useState<IStreamSchema | null>(null);
  const [selected_streams, setselectedstreams] = React.useState<string[]>([]);
  const [headers, setHeaders] = React.useState<ITableHeaderSchema[] | null>(
    null
  );
  const [selected_class, setselected_class] =
    React.useState<IClassSchema | null>(null);
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);
  const [groups, setgroups] = React.useState<IUserGroupSchema[]>([]);

  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [bottomView, setBottomView] = React.useState<boolean>(false);

  const router = useRouter();

  const FetchStreams = (params : object|null): void => {
    Custom_Axios()
      .get("/Streams" , {params})
      .then((response) => {
        if (response.status == 200) {
          setstreams(response.data);
        }
      });
  };

  const FetchStreamById = (
    id: string,
    OnSuccess: (data: IStreamSchema) => void
  ): void => {
    Custom_Axios()
      .get(`/Streams/${id}`)
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
        }
      });
  };

  const FetchClassById = (
    id: string,
    OnSuccess: (data: IClassSchema) => void
  ): void => {
    Custom_Axios()
      .get(`/Classes/${id}`)
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
        }
      });
  };

  const FetchClasses = (OnSuccess: (data: IClassSchema) => void): void => {
    Custom_Axios()
      .get("/Classes")
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
        }
      });
  };

  const Classheaders: ITableHeaderSchema[] = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "Class Id",
      alignment: "left",
      resolver: (row: IClassSchema) => row.id,
    },
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
      numeric: false,
      disablePadding: true,
      label: "Streams",
      alignment: "left",
      resolver: (row: IClassSchema) => row.streams.length,
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

  const createHeaders = (): void => {
    const headers: ITableHeaderSchema[] = [
      {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Class Id",
        alignment: "left",
        resolver: (row: IStreamSchema) => row.id,
      },
      {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Class",
        alignment: "left",
        resolver: (row: IStreamSchema) => row.name,
      },
      {
        id: "more_info",
        numeric: false,
        disablePadding: true,
        label: "More Info",
        alignment: "left",
        resolver: (row: IStreamSchema) => row.more_info,
      },
      {
        id: "addedAt",
        numeric: false,
        disablePadding: true,
        label: "Date Added",
        alignment: "left",
        resolver: (row: IStreamSchema) => toDDMMYYYY(row.addedAt),
      },
      {
        id: "updatedAt",
        numeric: false,
        disablePadding: true,
        label: "Date updated",
        alignment: "left",
        resolver: (row: IStreamSchema) => toDDMMYYYY(row.updatedAt),
      },
    ];

    setHeaders(headers);
  };

  const CreateStream = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const data: IPostStreamSchema = {
      name: formData.get("name") as string,
      more_info: formData.get("more_info") as string,
      classId: selected_class ? selected_class.id : "",
    };

    Custom_Axios()
      .post("/Streams", data)
      .then((response) => {
        if (response.status === 201) {
          setFeedback({
            status: "success",
            message: `stream created successfully`,
            outlined: false,
            open: true,
          });
          setsubmitting(false);
          setedit(false);

          setTimeout(() => {
            setFeedback(null);
          }, 4000);

          setactive_stream(null);
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
          defaultValue={active_stream ? active_stream.id : ""}
          disabled
          name="id"
          label="Stream id"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_stream ? active_stream.name : ""}
          name="name"
          label="Stream Name"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_stream ? active_stream.more_info : ""}
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
    setselectedstreams(e);
  };

  React.useEffect(() => {
    FetchStreams(selected_class? {'class' : selected_class.id} : null);
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
      <div className="ActionsRegionStream">
        <div className="ActionsStream">
          <Button
            variant="contained"
            onClick={() => {
              setactive_stream(null);
              setedit(true);
            }}
            disabled={selected_streams.length > 0}
            startIcon={<AddOutlinedIcon />}
          >
            Add
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              FetchStreamById(selected_streams[0], (data) => {
                setactive_stream(data);
                setedit(true);
              });
            }}
            disabled={!(selected_streams.length > 0)}
            startIcon={<SyncAltOutlinedIcon />}
          >
            Update
          </Button>

          <Button
            variant="contained"
            disabled={!(selected_streams.length > 0)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>

          <Button
            variant="contained"
            disabled={!(selected_streams.length > 0)}
            onClick={()=>{
              router.push('/students')
            }}
            startIcon={<DeleteIcon />}
          >
            View Students
          </Button>
        </div>

        <Button
          onClick={() => {
            setBottomView(true);
          }}
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Select Class
        </Button>
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

      <div className={"SearchStream"}>
        <Alert
          variant="outlined"
          severity={selected_class ? "success" : "warning"}
        >
          Active Class : {selected_class?.name}
        </Alert>

        <CustomSearch
          placeholder={"Search Stream"}
          icon_1={<SearchIcon />}
          icon_2={<MenuIcon />}
          value={""}
          onChange={(e) => {}}
        />
      </div>

      {streams != null ? (
        <div style={{ width: "90vw", paddingTop: "20px" }}>
          <NormalTable
            heading={"Users"}
            OnSelection={OnSelection}
            headers={headers}
            table_rows={streams}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <CircularProgress />
        </div>
      )}

      <Edit
        open={edit}
        Heading={"ADD STREAM"}
        onSubmit={CreateStream}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />

      <BottomView
        open={bottomView}
        onToggleDrawer={(s) => setBottomView(s)}
        onSelection={(selected) => {
          if (selected.length > 0) {
            setFeedback({
              status: "success",
              message: `Selected Successfully`,
              outlined: false,
              open: true,
            });
            setBottomView(false);
            FetchClassById(selected[0], (data) => {
              setselected_class(data);
            });
            FetchStreams({'class':selected[0]})
            setTimeout(() => {
              setFeedback(null);
            }, 3000);
          }
        }}
        viewheaders={Classheaders}
        getModel={(hook) => {
          FetchClasses(hook);
        }}
      />
    </>
  );
}
