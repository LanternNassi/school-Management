"use client";

import React, { useEffect, ReactNode } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import "./page.css";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Button from "@mui/material/Button";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Custom_Axios from "@/components/CustomAxios";
import IUserGroupSchema from "@/schema/IUserGroup";
import {IContactSchema , IPostContactSchema} from "@/schema/IContact";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import { IUserSchema } from "@/schema/IUsers";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import NormalTable from "@/components/Tables/NormalTable";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FeedBack, FeedBackProps } from "@/components/FeedBack";

import { toDDMMYYYY } from "@/Utils/ConvertDateTime";

import Edit from "@/components/Edit";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function page({ params }: { params: { user: string } }) {
  const [user, setuser] = React.useState<IUserSchema | null>(null);
  const [group, setgroup] = React.useState<IUserGroupSchema | null>(null);
  const [active_contact, setactive_contact] =
    React.useState<IContactSchema | null>(null);
  const [selected_contacts, setselectedcontacts] = React.useState<string[]>([]);
  const [headers, setheaders] = React.useState<ITableHeaderSchema[]>([]);
  const [edit, setedit] = React.useState<boolean>(false);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);
  const [contacts, setcontacts] = React.useState<IContactSchema[]>([]);

  const FetchUserById = (id: string): void => {
    Custom_Axios()
      .get(`/Users/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setuser(response.data);
          FetchGroup(response.data.group);
        }
      });
  };

  const FetchContactById = (
    id: string,
    onComplete: (data: IContactSchema) => void
  ): void => {
    Custom_Axios()
      .get(`Contacts/${id}`)
      .then((response) => {
        if (response.status == 200) {
          onComplete(response.data);
        }
      });
  };

  const FetchContactInfo = (): void => {
    Custom_Axios()
      .get("/Contacts")
      .then((response) => {
        if (response.status == 200) {
          setcontacts(response.data);
        }
      });
  };

  const FetchGroup = (id: string): void => {
    Custom_Axios()
      .get(`/UserGroups/${id}`)
      .then((response) => {
        if (response.status == 200) {
          setgroup(response.data);
        }
      });
  };

  const OnSelection = (e: string[]) => {
    setselectedcontacts(e);
  };

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const createheaders = (): void => {
    const headers: ITableHeaderSchema[] = [
      {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "Contact Id",
        alignment: "left",
        resolver: (row: IContactSchema) => row.id,
      },
      {
        id: "contact",
        numeric: false,
        disablePadding: true,
        label: "Contact ",
        alignment: "left",
        resolver: (row: IContactSchema) => row.contact,
      },
      {
        id: "email",
        numeric: false,
        disablePadding: true,
        label: "Email",
        alignment: "left",
        resolver: (row: IContactSchema) => row.email,
      },
      {
        id: "location",
        numeric: false,
        disablePadding: true,
        label: "Location",
        alignment: "left",
        resolver: (row: IContactSchema) => row.location,
      },
      {
        id: "addedAt",
        numeric: false,
        disablePadding: true,
        label: "Date Added",
        alignment: "left",
        resolver: (row: IContactSchema) => toDDMMYYYY(row.addedAt),
      },
    ];

    setheaders(headers);
  };

  const createContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const data : IPostContactSchema = {
        contact : formData.get('contact') as string,
        email : formData.get('email') as string,
        location : formData.get('location') as string,
        contactUser : user? user.id : ''
    }

    Custom_Axios()
      .post("/Contacts", data)
      .then((response) => {
        if (response.status === 201) {
          setFeedback({
            status: "success",
            message: `Contact created successfully`,
            outlined: false,
            open: true,
          });
          setsubmitting(false);
          setedit(false);

          setTimeout(() => {
            setFeedback(null);
          }, 4000);

          setactive_contact(null);
        }
      });

  };

  const Fields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_contact ? active_contact.contact : ""}
          name="contact"
          label="Contact"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_contact ? active_contact.email : ""}
          name="email"
          label="Email"
          variant="outlined"
        />
        <TextField
          sx={{ width: "25vw" }}
          defaultValue={active_contact ? active_contact.location : ""}
          name="location"
          label="Location"
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

  useEffect(() => {
    createheaders();
    FetchUserById(params.user);
    FetchContactInfo();
  }, [submitting]);

  if (user == null) {
    return (
      <div style={{ display: "flex", height: "100dvh", alignItems: "center" }}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      <FeedBack
        open={feedBack ? feedBack.open : false}
        message={feedBack ? feedBack.message : ""}
        outlined={feedBack ? feedBack.outlined : false}
        status={feedBack ? feedBack.status : "error"}
      />
      <div className="breadcrumbUser">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/users"
          >
            <AccountCircleOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            User
          </Link>

          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            {`${user?.firstName} ${user?.otherNames}`}
          </Typography>
        </Breadcrumbs>
      </div>

      <Card className="userCard">
        <CardHeader title={`${user?.firstName} ${user?.otherNames}`} />
        <CardContent className="cardContent">
          {/* <div className={"headerIcon"}>
            <AccountCircleIcon sx={{ fontSize: "130px" }} />
          </div> */}

          <div style={{ height: "7dvh", width: "80dvw" }}>
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }} gutterBottom>
              Profile Informantion
            </Typography>
          </div>
          <div className={"userInfo"}>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`User ID : ${user?.id}`}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`First Name : ${user?.firstName}`}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`Other Names : ${user?.otherNames}`}
            </Typography>

            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`Username : ${user?.username}`}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`User Group : ${group?.name}`}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
              {`Date Added : ${toDDMMYYYY(user?.addedAt)}`}
            </Typography>
          </div>

          <div
            style={{
              height: "15dvh",
              width: "80dvw",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }} gutterBottom>
              Contact Informantion
            </Typography>
          </div>

          <div className="ActionsRegion">
            <div className="Actions">
              <Button
                variant="contained"
                onClick={() => {
                  setactive_contact(null);
                  setedit(true);
                }}
                disabled={selected_contacts.length > 0}
                startIcon={<AddOutlinedIcon />}
              >
                Add
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  FetchContactById(selected_contacts[0], (data) => {
                    setactive_contact(data);
                    setedit(true);
                  });
                }}
                disabled={!(selected_contacts.length > 0)}
                startIcon={<SyncAltOutlinedIcon />}
              >
                Update
              </Button>

              <Button
                variant="contained"
                disabled={!(selected_contacts.length > 0)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>

              <Button
                variant="contained"
                disabled={!(selected_contacts.length > 0)}
                startIcon={<ExitToAppOutlinedIcon />}
              >
                View
              </Button>
            </div>
          </div>

          <div className="contactTable">
            <NormalTable
              heading={"Contacts"}
              OnSelection={OnSelection}
              headers={headers}
              table_rows={contacts}
            />
          </div>
        </CardContent>
      </Card>
    <div style={{
        height : '10dvh',
        width : '90dvw',
        

    }}/>
      <Edit
        open={edit}
        Heading={"ADD Contact"}
        onSubmit={createContact}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </>
  );
}
