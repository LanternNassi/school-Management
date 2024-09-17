/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { ReactNode } from "react";
import {
  Button,
  Divider,
  Tab,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Edit from "@/components/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import {
  IAcademicTermSchema,
  IPostAcademicTermSchema,
} from "@/schema/IAcademicTermSchema";
import "./page.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import { FeedBackProps, FeedBack } from "@/components/FeedBack";

import { toDDMMYYYY } from "@/Utils/ConvertDateTime";
import Custom_Axios from "@/components/CustomAxios";
import { useRouter } from "next/navigation";

export default function page() {
  const [Value, SetValue] = React.useState<string>("1");

  const [selected_term, setSelectedTerm] =
    React.useState<IAcademicTermSchema | null>(null);

  const [feedBack, setFeedback] = React.useState<FeedBackProps | null>(null);
  const [submitting, setsubmitting] = React.useState<boolean>(false);
  const [edit, setedit] = React.useState<boolean>(false);
  const [terms, setTerms] = React.useState<IAcademicTermSchema[] | null>(null);
  const [sorted_terms, set_sorted_terms] = React.useState<
    { year: string; terms: IAcademicTermSchema[] }[] | null
  >(null);
  const [active_tab, set_active_tab] = React.useState<string>(
    sorted_terms ? sorted_terms[0].year : "2024"
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    set_active_tab(newValue);
  };

  const router = useRouter();

  const UpdateTerm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const data = new FormData(event.currentTarget as HTMLFormElement);
    Custom_Axios()
      .put(`/Terms/${selected_term?.id}`, selected_term)
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
      });

    GetTerms();

    setsubmitting(false);
  };

  const AddTerm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setsubmitting(true);
    const data = new FormData(event.currentTarget as HTMLFormElement);

    const payload: IPostAcademicTermSchema = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      isActive: (data.get("isActive") as string) == "true" ? true : false,
      startDate: dayjs(String(data.get("startDate"))).toISOString() as string,
      endDate: dayjs(String(data.get("endDate"))).toISOString() as string,
    };

    Custom_Axios()
      .post("/Terms", payload)
      .then((response) => {
        if (response.status == 201) {
          setFeedback({
            message: "Term Added Successfully",
            open: true,
            status: "success",
            outlined: false,
          });
        } else {
          setFeedback({
            message: "Failed to add term",
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
      });

    GetTerms();

    setsubmitting(false);
  };

  const GetTerms = () => {
    Custom_Axios()
      .get("/Terms")
      .then((response) => {
        if (response.status === 200) {
          const data = response.data as IAcademicTermSchema[];
          setTerms(data);
          set_sorted_terms(sort_terms(data) || null);
        }
      });
  };

  const GetRunningTerm = (): IAcademicTermSchema | null => {
    let runningTerm: IAcademicTermSchema | null = null;
    terms?.forEach((term) => {
      if (term.isActive) {
        runningTerm = term;
      }
    });
    return runningTerm;
  };

  const sort_terms = (terms_: IAcademicTermSchema[]) => {
    if (terms_) {
      const sorted = terms_.reduce((acc, term) => {
        const year = dayjs(term.startDate).year().toString();
        if (acc[year]) {
          acc[year].push(term);
        } else {
          acc[year] = [term];
        }
        return acc;
      }, {} as { [key: string]: IAcademicTermSchema[] });

      const sorted_array = Object.keys(sorted).map((key) => {
        return { year: key, terms: sorted[key] };
      });

      return sorted_array;
    }
  };

  const toggleEditDrawer = (newOpen: boolean) => {
    setedit(newOpen);
  };

  const Fields = (): ReactNode => {
    return (
      <>
        <TextField
          sx={{ width: "25vw" }}
          disabled
          name="id"
          label="Term id"
          variant="outlined"
          defaultValue={selected_term ? selected_term.id : ""}
        />
        <TextField
          sx={{ width: "25vw" }}
          name="name"
          onChange={(e) => {
            if (selected_term) {
              setSelectedTerm({ ...selected_term, name: e.target.value });
            }
          }}
          label="Term Name"
          variant="outlined"
          defaultValue={selected_term ? selected_term.name : ""}
        />
        <TextField
          sx={{ width: "25vw" }}
          name="description"
          label="Description"
          variant="outlined"
          multiline
          defaultValue={selected_term ? selected_term.description : ""}
          rows={4}
          onChange={(e) => {
            if (selected_term) {
              setSelectedTerm({
                ...selected_term,
                description: e.target.value,
              });
            }
          }}
        />
        <TextField
          select
          sx={{ width: "25vw" }}
          name="isActive"
          label="Active"
          variant="outlined"
          defaultValue={selected_term ? selected_term.isActive : ""}
          onChange={(e) => {
            if (selected_term) {
              setSelectedTerm({
                ...selected_term,
                isActive: Boolean(e.currentTarget),
              });
            }
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
                defaultValue={
                  selected_term
                    ? dayjs(selected_term.startDate.toString())
                    : dayjs(Date.now())
                }
                onChange={(value) => {
                  if (selected_term) {
                    setSelectedTerm({
                      ...selected_term,
                      startDate: value
                        ? value.toISOString()
                        : dayjs(Date.now()).toISOString(),
                    });
                  }
                }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                name="endDate"
                label="End Date"
                sx={{ width: "25vw" }}
                defaultValue={
                  selected_term
                    ? dayjs(selected_term.endDate.toString())
                    : dayjs(Date.now())
                }
                onChange={(value) => {
                  if (selected_term) {
                    setSelectedTerm({
                      ...selected_term,
                      endDate: value
                        ? value.toISOString()
                        : dayjs(Date.now()).toISOString(),
                    });
                  }
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
          <span>Submit</span>
        </LoadingButton>
      </>
    );
  };


  React.useEffect(() => {
    GetTerms();
  }, []);

  return (
    <div>
      <FeedBack
        open={feedBack ? feedBack.open : false}
        message={feedBack ? feedBack.message : ""}
        outlined={feedBack ? feedBack.outlined : false}
        status={feedBack ? feedBack.status : "error"}
      />
      <div className="ActionsRegionTerm">
        <div className="ActionsTerm">
          <Button
            variant="contained"
            onClick={() => {
              setSelectedTerm(null);
              setedit(true);
            }}
            startIcon={<AddOutlinedIcon />}
          >
            Add
          </Button>

          <Button
            onClick={() => {
              setedit(true);
            }}
            variant="contained"
            startIcon={<SyncAltOutlinedIcon />}
          >
            Update
          </Button>

          <Button variant="contained" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </div>
            
        <Alert
          variant="outlined"
          severity={GetRunningTerm() ? "success" : "warning"}
        >
          Active Term : {GetRunningTerm()?.name}
        </Alert>

        
      </div>

      <TabContext value={active_tab}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          {sorted_terms?.map((term) => {
            return <Tab key={term.year} label={term.year} value={term.year} />;
          })}
        </TabList>
        {sorted_terms?.map((term) => {
          return (
            <TabPanel key={term.year} className="section" value={term.year}>
              <div className="sectionItem">
                {term.terms.map((term) => {
                  return (
                    <div
                      onClick={() => {
                        // setSelectedTerm(term);
                        // setedit(true);
                        router.push(`academicterm/${term.id}`)
                        
                      }}
                      key={term.id}
                      className="item"
                    >
                      <Typography variant="h6">{term.name}</Typography>
                      <Typography variant="body1">
                        {term.description.slice(0, 15)}
                      </Typography>
                      <Typography variant="body1">
                        {toDDMMYYYY(term.startDate)} -{" "}
                        {toDDMMYYYY(term.endDate)}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </TabPanel>
          );
        })}
      </TabContext>

      <Edit
        open={edit}
        Heading={selected_term ? "UPDATE ACADEMIC TERM" : "ADD ACADEMIC TERM"}
        onSubmit={selected_term ? UpdateTerm : AddTerm}
        toggleDrawer={toggleEditDrawer}
        Fields={Fields}
      />
    </div>
  );
}
