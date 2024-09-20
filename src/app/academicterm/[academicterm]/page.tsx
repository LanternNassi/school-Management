/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { ReactNode } from "react";
import Custom_Axios from "@/components/CustomAxios";
import { IAcademicTermResponse } from "@/schema/IAcademicTermSchema";
import "./page.css";

import NormalTable from "@/components/Tables/NormalTable";
import ITableHeaderSchema from "@/schema/ITableHeaders";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";

import { PieChart } from "@mui/x-charts";

import {
  CircularProgress,
  Button,
  Typography,
  Grid,
  Card,
  MenuItem,
  TextField,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  Chip,
} from "@mui/material";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Edit from "@/components/Edit";
import { FeedBackProps, FeedBack } from "@/components/FeedBack";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import FormatMoney from "@/Utils/MoneyFormatter";
import { truncate } from "fs";
import { useRouter } from "next/navigation";


export default function page({ params }: { params: { academicterm: string } }) {
  const [term, setTerm] = React.useState<IAcademicTermResponse | null>(null);
  const [selected_meta, setselected_meta] = React.useState<string[]>([]);
  const [headers, setHeaders] = React.useState<ITableHeaderSchema[]>([]);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [edit, setedit] = React.useState<boolean>(false);
  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);

  const GetTermInfo = (term_id: string): void => {
    Custom_Axios()
      .get(`/Terms/${term_id}?includeAll=true`)
      .then((response) => {
        if (response.status == 200) {
          setTerm(response.data);
        }
      });
  };

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const UpdateTerm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(term?.term);

    setsubmitting(true);
    const data = new FormData(event.currentTarget as HTMLFormElement);
    Custom_Axios()
      .put(`/Terms/${term?.term.id}`, term?.term)
      .then((response) => {
        if (response.status == 200) {
          setFeedback({
            message: "Term updated Successfully",
            open: true,
            status: "success",
            outlined: false,
          });
        } else {
          setFeedback({
            message: "Failed to update term",
            open: true,
            status: "error",
            outlined: false,
          });
        }

        setsubmitting(false);
        setedit(false);

        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      })
      .catch((error) => {
        setFeedback({
          message: error.response.data,
          open: true,
          status: "error",
          outlined: false,
        });

        setsubmitting(false);
        setedit(false);

        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      });

    GetTermInfo(params.academicterm);
    createHeaders();

    setsubmitting(false);
  };

  const OnSelection = (rows: string[]) => {
    setselected_meta(rows);
  };

  interface IChartData {
    header: string;
    data: { label: string; value: number }[];
  }

  const Chart = (props: IChartData) => {
    return (
      <Card sx={{ minWidth: "10vw", height: "50vh" }}>
        <CardHeader title={props.header} />
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "25vw",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <PieChart
              series={[
                {
                  paddingAngle: 5,
                  innerRadius: 60,
                  outerRadius: 80,
                  data: props.data,
                },
              ]}
              margin={{ right: 5 }}
              width={200}
              height={200}
              legend={{ hidden: true }}
            />

            <List>
              {props.data.map((item, index) => {
                return (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.label.replace("_", " ")}
                      secondary={FormatMoney(item.value)}
                    />
                  </ListItem>
                );
              })}
            </List>
          </div>
        </CardContent>
      </Card>
    );
  };

  const createHeaders = (): void => {
    const headers: ITableHeaderSchema[] = [
      {
        id: "id",
        numeric: false,
        disablePadding: false,
        label: "Class",
        alignment: "left",
        resolver: (row) => row.class.name,
      },
      {
        id: "total students",
        numeric: true,
        disablePadding: false,
        label: "Total Students",
        alignment: "left",
        resolver: (row) => row.total_students,
      },
      {
        id: "total Fees",
        numeric: true,
        disablePadding: false,
        label: "Total Fees",
        alignment: "left",
        resolver: (row) => FormatMoney(row.total_term_fees),
      },
      {
        id: "total paid fees",
        numeric: true,
        disablePadding: false,
        label: "Paid Fees",
        alignment: "left",
        resolver: (row) => FormatMoney(row.total_paid_fees),
      },
      {
        id: "total unpaid fees",
        numeric: true,
        disablePadding: false,
        label: "Unpaid Fees",
        alignment: "left",
        resolver: (row) => FormatMoney(row.total_unpaid_fees),
      },
    ];

    setHeaders(headers);
  };

  React.useEffect(() => {
    GetTermInfo(params.academicterm);
    createHeaders();
  }, []);

  const Fields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          disabled
          name="id"
          label="Term id"
          variant="outlined"
          defaultValue={term?.term.id}
        />
        <TextField
          sx={{ width: "25vw" }}
          name="name"
          onChange={(e) => {
            setTerm(
              term
                ? {
                    ...term,
                    term: {
                      ...term.term,
                      name: e.target.value,
                    },
                  }
                : null
            );
          }}
          label="Term Name"
          variant="outlined"
          defaultValue={term?.term.name}
        />
        <TextField
          sx={{ width: "25vw" }}
          name="description"
          label="Description"
          variant="outlined"
          multiline
          defaultValue={term?.term.description}
          rows={4}
          onChange={(e) => {
            setTerm(
              term
                ? {
                    ...term,
                    term: {
                      ...term.term,
                      description: e.target.value,
                    },
                  }
                : null
            );
          }}
        />
        <TextField
          select
          sx={{ width: "25vw" }}
          name="isActive"
          label="Active"
          variant="outlined"
          defaultValue={term?.term.isActive ? "true" : "false"} // Ensure it's a string for matching the MenuItem values
          onChange={(e) => {
            const value = e.target.value === "true"; // Convert string to boolean
            setTerm(
              term
                ? {
                    ...term,
                    term: {
                      ...term.term,
                      isActive: value, // Set the boolean value correctly
                    },
                  }
                : null
            );
          }}
        >
          <MenuItem key={"true"} value={"true"}>
            {"true"}
          </MenuItem>
          <MenuItem key={"false"} value={"false"}>
            {"false"}
          </MenuItem>
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid
            container
            spacing={2}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingTop={"1rem"}
          >
            <Grid item>
              <DatePicker
                name="startDate"
                label="Start Date"
                sx={{ width: "25vw" }}
                defaultValue={dayjs(term?.term.startDate.toString())}
                onChange={(value) => {
                  setTerm(
                    term
                      ? {
                          ...term,
                          term: {
                            ...term.term,
                            startDate: value
                              ? value.toISOString()
                              : dayjs(Date.now()).toISOString(),
                          },
                        }
                      : null
                  );
                }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                name="endDate"
                label="End Date"
                sx={{ width: "25vw" }}
                defaultValue={dayjs(term?.term.endDate.toString())}
                onChange={(value) => {
                  setTerm(
                    term
                      ? {
                          ...term,
                          term: {
                            ...term.term,
                            endDate: value
                              ? value.toISOString()
                              : dayjs(Date.now()).toISOString(),
                          },
                        }
                      : null
                  );
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <LoadingButton
          type="submit"
          sx={{ width: "25vw", height: "8vh" }}
          variant="contained"
          tabIndex={-1}
          loading={submitting}
          loadingPosition="start"
          startIcon={<SaveIcon fontSize="large" />}
        >
          <span>{`Update ${term?.term.name}`}</span>
        </LoadingButton>
      </>
    );
  };

  if (term == null) {
    return (
      <div className={"spinner_ov"}>
        <CircularProgress />
      </div>
    );
  }

  const router = useRouter();

  return (
    <>
      <FeedBack
        open={feedBack ? feedBack.open : false}
        message={feedBack ? feedBack.message : ""}
        outlined={feedBack ? feedBack.outlined : false}
        status={feedBack ? feedBack.status : "error"}
      />

      <div
        style={{
          marginBottom: "0.5rem",
          marginTop: "1rem",

          width: "90dvw",
          height: "2rem",

          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/academicterm"
          >
            <AccountCircleOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Terms
          </Link>

          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            {term.term.name}
          </Typography>
        </Breadcrumbs>

        <Chip
          label={term.term.isActive ? "Active Term" : "Not Active"}
          color={term.term.isActive ? "success" : "warning"}
        />
      </div>

      <div className={"termcontainer"}>
        <Card className={"term-panel-info"}>
          <CardHeader title={`${term.term.name}`}></CardHeader>
          <CardContent>
            <div style={{ height: "7dvh", width: "60dvw" }}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Term Information
              </Typography>
            </div>
            <div className={"termInfo"}>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Name : ${term.term.name}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Description : ${term.term.description}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Status : ${term.term.isActive ? "Active" : "Inactive"}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Start Date : ${toDDMMYYYY(term.term.startDate)}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`End Date : ${toDDMMYYYY(term.term.endDate)}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Total Students : ${term.meta_data.total_students}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Paid Fees : ${FormatMoney(term.meta_data.total_paid_fees)}`}
              </Typography>
              <Typography sx={{ fontSize: 14 }} color="text.primary">
                {`Unpaid Fees : ${FormatMoney(
                  term.meta_data.total_unpaid_fees
                )}`}
              </Typography>
            </div>

            <div
              style={{
                height: "13dvh",
                width: "60dvw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Class Statistics
              </Typography>
            </div>

            <div className={"termclassTable"}>
              <NormalTable
                heading={`${term.term.name} Classes`}
                OnSelection={OnSelection}
                headers={headers}
                table_rows={term.class_meta_data}
                onRowClick={(event: any, row: any) => {
                  router.push(`/academicterm/${term.term.id}/class/${row.id}`);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div className={"term-panel-meta"}>
          <div className={"term-panel-numeric"}>
            <Chart
              header={`Fees Payment`}
              data={[
                {
                  label: "Paid Fees",
                  value: 300000,
                  // value : term.meta_data.total_paid_fees
                },
                {
                  label: "Unpaid Fees",
                  value: 200000,
                  // value : term.meta_data.total_unpaid_fees
                },
              ]}
            />
          </div>
          <Button
            variant="contained"
            onClick={() => {
              setedit(true);
            }}
            startIcon={<AccountCircleOutlined />}
          >
            {`Edit ${term.term.name} initials`}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              router.push(`/academicterm/${term.term.id}/class/${selected_meta[0]}`);
            }}
            disabled={!selected_meta.length}
            startIcon={<AccountCircleOutlined />}
          >
            {`Students Management`}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {}}
            startIcon={<AutoDeleteOutlinedIcon />}
          >
            {`Delete ${term.term.name}`}
          </Button>
        </div>
      </div>

      <Edit
        open={edit}
        Heading={"UPDATE ACADEMIC TERM"}
        onSubmit={UpdateTerm}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </>
  );
}
