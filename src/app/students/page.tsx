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

import { IStudentSchema , IPostStudentSchema } from "@/schema/IStudentSchema";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import Edit from "@/components/Edit";


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
import { IStreamSchema } from "@/schema/IStreamSchema";

export default function page() {
  const [students, setstudents] = React.useState<IStudentSchema[] | null>(null);
  const [active_student, setactive_student] =
    React.useState<IStudentSchema | null>(null);
  const [selected_students, setselectedstudents] = React.useState<string[]>([]);
  const [headers, setHeaders] = React.useState<ITableHeaderSchema[] | null>(
    null
  );

  const [active_stream , setactive_stream] = React.useState<IStreamSchema | null>(null);
  
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);

  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [bottomView, setBottomView] = React.useState<boolean>(false);

  const router = useRouter();

  const FetchStudents = (params : object|null): void => {
    Custom_Axios()
      .get("/Students" , {params})
      .then((response) => {
        if (response.status == 200) {
          setstudents(response.data);
        }
      });
  };

  const FetchStudentById = (
    id: string,
    OnSuccess: (data: IStudentSchema) => void
  ): void => {
    Custom_Axios()
      .get(`/Streams/${id}`)
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
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
    OnSuccess: (data: IStudentSchema) => void
  ): void => {
    Custom_Axios()
      .get(`/Students/${id}`)
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
        }
      });
  };


  const FetchStreams = (OnSuccess: (data: IStreamSchema[]) => void): void => {
    Custom_Axios()
      .get("/Streams")
      .then((response) => {
        if (response.status == 200) {
          OnSuccess(response.data);
        }
      });
  };
  

  const createHeaders = (): void => {
    const Studentsheaders: ITableHeaderSchema[] = [
      {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Student Id",
        alignment: "left",
        resolver: (row: IStudentSchema) => row.id,
      },
      {
        id: "firstName",
        numeric: false,
        disablePadding: true,
        label: "Name",
        alignment: "left",
        resolver: (row: IStudentSchema) => `${row.firstName} ${row.otherNames}`,
      },
      {
        id: "payCode",
        numeric: false,
        disablePadding: true,
        label: "Pay Code",
        alignment: "left",
        resolver: (row: IStudentSchema) => row.payCode,
      },
      {
        id: "Stream",
        numeric: false,
        disablePadding: true,
        label: "Stream",
        alignment: "left",
        resolver: (row: IStudentSchema) => row.stream.name,
      },
      {
        id: "addedAt",
        numeric: false,
        disablePadding: true,
        label: "Date Added",
        alignment: "left",
        resolver: (row: IStudentSchema) => toDDMMYYYY(row.addedAt),
      },
      {
        id: "updatedAt",
        numeric: false,
        disablePadding: true,
        label: "Date updated",
        alignment: "left",
        resolver: (row: IStudentSchema) => toDDMMYYYY(row.updatedAt),
      },
    ];

    setHeaders(Studentsheaders);
  };

  const streamheaders: ITableHeaderSchema[] = [
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

  const CreateStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const data: IPostStudentSchema = {
      firstName: formData.get("firstName") as string,
      otherNames: formData.get("otherNames") as string,
      payCode: formData.get("payCode") as string,
      streamId : active_stream ? active_stream.id : "",
    };

    Custom_Axios()
      .post("/Students", data)
      .then((response) => {
        if (response.status === 201) {
          setFeedback({
            status: "success",
            message: `student created successfully`,
            outlined: false,
            open: true,
          });
          setsubmitting(false);
          setedit(false);

          setTimeout(() => {
            setFeedback(null);
          }, 4000);

          setactive_student(null);
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
          defaultValue={active_student ? active_student.id : ""}
          disabled
          name="id"
          label="Student id"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_student ? active_student.firstName : ""}
          name="firstName"
          label="First Name"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_student ? active_student.otherNames : ""}
          name="otherNames"
          label="Other Names"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_student ? active_student.otherNames : ""}
          name="payCode"
          label="Student Pay Code"
          variant="outlined"
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
    setselectedstudents(e);
  };

  React.useEffect(() => {
    FetchStudents(active_stream? {'streamId' : active_stream.id} : null);
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
      <div className="ActionsRegionStudent">
        <div className="ActionsStudent">
          <Button
            variant="contained"
            onClick={() => {
              setselectedstudents([]);
              setedit(true);
            }}
            disabled={selected_students.length > 0}
            startIcon={<AddOutlinedIcon />}
          >
            Add
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              FetchStudentById(selected_students[0], (data) => {
                setactive_student(data);
                setedit(true);
              });
            }}
            disabled={!(selected_students.length > 0)}
            startIcon={<SyncAltOutlinedIcon />}
          >
            Update
          </Button>

          <Button
            variant="contained"
            disabled={!(selected_students.length > 0)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </div>

        <Button
          onClick={() => {
            setBottomView(true);
          }}
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Select Stream
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

      <div className={"SearchStudent"}>
        <Alert
          variant="outlined"
          severity={active_stream ? "success" : "warning"}
        >
          Active Stream : {active_stream?.name}
        </Alert>

        <CustomSearch
          placeholder={"Search Student"}
          icon_1={<SearchIcon />}
          icon_2={<MenuIcon />}
          value={""}
          onChange={(e) => {}}
        />
      </div>

      {students != null ? (
        <div style={{ width: "90vw", paddingTop: "20px" }}>
          <NormalTable
            heading={"Users"}
            OnSelection={OnSelection}
            headers={headers}
            table_rows={students}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <CircularProgress />
        </div>
      )}

      <Edit
        open={edit}
        Heading={"ADD Student"}
        onSubmit={CreateStudent}
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
            FetchStreamById(selected[0], (data) => {
              setactive_stream(data);
            });
            FetchStudents({'streamId':selected[0]})
            setTimeout(() => {
              setFeedback(null);
            }, 3000);
          }
        }}
        viewheaders={streamheaders}
        getModel={(hook) => {
          FetchStreams(hook);
        }}
      />
    </>
  );
}
