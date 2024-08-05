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
  const [users, setUsers] = React.useState<IUserSchema[] | null>(null);
  const [active_user, setactive_user] = React.useState<IUserSchema | null>(
    null
  );
  const [selected_users, setselectedusers] = React.useState<string[]>([]);
  const [headers, setHeaders] = React.useState<ITableHeaderSchema[] | null>(
    null
  );
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);
  const [groups, setgroups] = React.useState<IUserGroupSchema[]>([]);

  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);

  const router = useRouter();

  const FetchUsers = (): void => {
    Custom_Axios()
      .get("/Users")
      .then((response) => {
        if (response.status == 200) {
          setUsers(null);
          setUsers(response.data);
        }
      });
  };

  const FetchGroups = (): void => {
    Custom_Axios()
      .get("/UserGroups")
      .then((response) => {
        if (response.status == 200) {
          setgroups(response.data);
        }
      });
  };

  const FetchUser = (
    user_id: string,
    onSuccess: (data: IUserSchema) => void
  ): void => {
    Custom_Axios()
      .get(`/Users/${user_id}`)
      .then((response) => {
        if (response.status == 200) {
          onSuccess(response.data);
        }
      });
  };

  const getGroupById = (
    ex_groups: IUserGroupSchema[] | null,
    id: string
  ): IUserGroupSchema | null => {
    let group_name: IUserGroupSchema | null = null;
    ex_groups?.forEach((element) => {
      if (element.id === id) {
        group_name = element;
        return;
      }
    });

    return group_name;
  };

  const createHeaders = (): void => {
    let ex_groups: IUserGroupSchema[] | null = null;

    Custom_Axios()
      .get("/UserGroups")
      .then((response) => {
        if (response.status == 200) {
          ex_groups = response.data;
        }
      });
    const headers: ITableHeaderSchema[] = [
      {
        id: "group",
        numeric: false,
        disablePadding: true,
        label: "Group",
        alignment: "left",
        resolver: (row: IUserSchema) =>
          getGroupById(ex_groups, row.group)?.name,
      },
      {
        id: "firstName",
        numeric: false,
        disablePadding: true,
        label: "First Name",
        alignment: "left",
        resolver: (row: IUserSchema) => row.firstName,
      },
      {
        id: "otherNames",
        numeric: false,
        disablePadding: true,
        label: "Other Names",
        alignment: "left",
        resolver: (row: IUserSchema) => row.otherNames,
      },
      {
        id: "username",
        numeric: false,
        disablePadding: true,
        label: "Username",
        alignment: "left",
        resolver: (row: IUserSchema) => row.username,
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

  const CreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const data: IUserPostSchema = {
      firstName: formData.get("firstName") as string,
      otherNames: formData.get("otherNames") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      group: formData.get("group") as string,
    };

    Custom_Axios()
      .post("/Users", data)
      .then((response) => {
        if (response.status === 201) {
          setFeedback({
            status: "success",
            message: `${data.firstName} created successfully`,
            outlined: false,
            open: true,
          });
          setsubmitting(false);
          setedit(false);

          setTimeout(() => {
            setFeedback(null);
          }, 4000);

          setactive_user(null);
        }
      });
  };

  const UpdateUser = (event: React.FormEvent<HTMLFormElement>) => {};

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const Fields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_user ? active_user.firstName : ""}
          name="firstName"
          label="First Name"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_user ? active_user.otherNames : ""}
          name="otherNames"
          label="Other Names"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_user ? active_user.username : ""}
          name="username"
          label="UserName"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={""}
          name="password"
          type="password"
          label="Password"
          variant="outlined"
        />
        <TextField
          select
          sx={{ width: "25vw" }}
          defaultValue={active_user ? active_user.group : ""}
          name="group"
          label="Access Level"
          variant="outlined"
        >
          {groups.map((group, index) => (
            <MenuItem key={"group"} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>

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
    setselectedusers(e);
  };

  React.useEffect(() => {
    FetchGroups();
    FetchUsers();
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
      <div className="ActionsRegion">
        <div className="Actions">
          <Button
            variant="contained"
            onClick={() => {
              setactive_user(null);
              setedit(true);
            }}
            disabled={selected_users.length > 0}
            startIcon={<AddOutlinedIcon />}
          >
            Add
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              FetchUser(selected_users[0], (data) => {
                setactive_user(data);
                setedit(true);
              });
            }}
            disabled={!(selected_users.length > 0)}
            startIcon={<SyncAltOutlinedIcon />}
          >
            Update
          </Button>

          <Button
            variant="contained"
            disabled={!(selected_users.length > 0)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>

          <Button
            variant="contained"
            onClick={()=>{
              router.push(`users/${selected_users[0]}`);
            }}
            disabled={!(selected_users.length > 0)}
            startIcon={<ExitToAppOutlinedIcon />}
          >
            View
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

      <div className={"Search"}>
        <CustomSearch
          placeholder={"Search User"}
          icon_1={<SearchIcon />}
          icon_2={<MenuIcon />}
          value={""}
          onChange={(e) => {}}
        />
      </div>

      {users != null ? (
        <div style={{ width: "90vw", paddingTop: "20px" }}>
          <NormalTable
            heading={"Users"}
            OnSelection={OnSelection}
            headers={headers}
            table_rows={users}
          />
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <CircularProgress />
        </div>
      )}

      <Edit
        open={edit}
        Heading={"ADD USER"}
        onSubmit={CreateUser}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </>
  );
}
