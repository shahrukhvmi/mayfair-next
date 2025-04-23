import React, { useState, useEffect } from "react";
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import { useProfileUserDataQuery, useUserUpdateMutation } from "@/store/dashboardApi";
import { useFetchAddressesForBillingQuery, useFetchAddressesQuery } from "@/store/addressApi";

const MyAddress = () => {
  const [activeTab, setActiveTab] = useState("shipping");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [zipCodeBill, setZipCodeBill] = useState("");
  const [addressOptionsBilling, setAddressOptionsBilling] = useState([]);

  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: errorsShipping, isValid: isValidShipping },
    setValue: setValueShipping,
    getValues: getValuesShipping,
    watch: watchShipping,
    trigger: triggerShipping,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      postCode: "",
      country: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
    },
  });

  const {
    register: registerBilling,
    handleSubmit: handleSubmitBilling,
    formState: { errors: errorsBilling, isValid: isValidBilling },
    setValue: setValueBilling,
    getValues: getValuesBilling,
    watch: watchBilling,
    trigger: triggerBilling,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      billingStreetAddress: "",
      billingStreetAddress2: "",
      billingCity: "",
      billingState: "",
      billingPostalCode: "",
      billingCountry: "",
    },
  });
  const [user, setUserData] = useState();
  const [countries, setCountry] = useState([]);
  const [BillingCountrys, setBillingCountrys] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [searchClickedBill, setSearchClickedBill] = useState(false);
  const [billingAddres, setBillingAddres] = useState({ country: "" });
  const [zipCode, setZipCode] = useState("");

  const { data: getData, refetch, isLoading: isDataLoaded } = useProfileUserDataQuery();

  const [updateUserProfile, { isLoading: isPostLoding }] = useUserUpdateMutation();

  useEffect(() => {

    if (getData) {
      const user = getData;
      localStorage.setItem("userData", JSON.stringify(user));

      // Update state
      setUserData(user);
      setCountry(user?.profile?.billing_countries);
      setBillingCountrys(user?.profile?.billing_countries);
      const initialStates = countries.map((_, index) => index < 3);
      setSelectedStates(initialStates);
    }
  }, [getData, isDataLoaded, refetch]);
  const shippingValues = watchShipping();
  const billingValues = watchBilling();
  useEffect(() => { }, [shippingValues, billingValues]);

  const profile = user?.profile || {};

  // Safely access billing and shipping properties
  const billing = profile?.billing || null;
  const shipping = profile?.shipping || null;

  // Shiping BillingPost Api Call Here  👇👇👇
  const [loading, setIsLoading] = useState(false);




  useEffect(() => {
    if (billing) {
      setValueBilling("billingCountry", billing?.country || "");
      setValueBilling("billingStreetAddress", billing?.addressone || "");
      setValueBilling("billingStreetAddress2", billing?.addresstwo || "");
      setValueBilling("billingCity", billing?.city || "");
      setValueBilling("billingState", billing?.state || "");
      setValueBilling("billingPostalCode", billing?.postalcode || "");
      triggerBilling([
        "billingCountry",
        "billingStreetAddress",
        "billingStreetAddress2",
        "billingCity",
        "billingState",
        "billingCountry",
        "billingPostalCode",
      ]);
    }
  }, [isDataLoaded, billing, setValueBilling, triggerBilling]);

  useEffect(() => {
    if (shipping) {
      setValueShipping("country", shipping?.country || "");
      setValueShipping("streetAddress", shipping?.addressone || "");
      setValueShipping("streetAddress2", shipping?.addresstwo || "");
      setValueShipping("city", shipping?.city || "");
      setValueShipping("state", shipping?.state || "");
      setValueShipping("postalCode", shipping?.postalcode || "");

      triggerShipping(["country", "streetAddress", "streetAddress2", "city", "state", "postalCode"]);
    }
  }, [shipping, setValueShipping, triggerShipping]);

  useEffect(() => {
    if (activeTab == "shipping") {
      setZipCode(shipping?.postalcode);
    } else if (activeTab == "billing") {
      setZipCode(billing?.postalcode);
    }
  }, [activeTab, billing, shipping]);

  // 👇👇**RTK Query - Fetch addresses**👇👇
  const { data, error, isLoading } = useFetchAddressesQuery(zipCode, {
    skip: !searchClicked || !zipCode,
  });
  const {
    data: dataBill,
    error: errorBill,
    isLoading: load,
  } = useFetchAddressesForBillingQuery(zipCodeBill, {
    skip: !searchClickedBill || !zipCodeBill,
  });
  if (error) {
    toast.error(error?.message || "Invalid Postal Code");
  }

  // **Handle Tab Switching**
  const tabActive = (tabValue) => {
    setActiveTab(tabValue);

    setSelectedAddress(null);
    setAddressOptions([]);
    setSearchClicked(false);
    if (tabValue === "shipping") {
      setZipCode(shipping?.postalcode ?? "");
    } else {
      setZipCode(billing?.postalcode ?? "");
    }
    // 👇👇 Apply GSAP Animation👇👇
    gsap.fromTo(`.tab-${tabValue}`, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" });

    gsap.fromTo(`.tab-text-${tabValue}`, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "bounce.out" });
  };

  const handleSearch = () => {
    if (zipCode.trim() !== "") {
      setSearchClicked(true);
    } else {
      toast.error(error?.message);
    }
  };
  const handleSearchBilling = () => {
    if (zipCodeBill.trim() !== "") {
      setSearchClickedBill(true);
    } else {
      toast.error(errorBill?.message);
    }
  };
  const handleSelect = (index, setValue) => {
    const selected = addressOptions[index];
    setSelectedAddress(selected);
    setValue("streetAddress", selected.line_1 || "");
    setValue("streetAddress2", selected.line_2 || "");
    setValue("city", selected.town_or_city || "");
    setValue("state", selected.county || "");
    setValue("postalCode", zipCode || "");
  };
  const handleSelectBilling = (index, setValue) => {
    const selected = addressOptionsBilling[index];
    setSelectedAddress(selected);
    setValue("billingStreetAddress", selected.line_1 || "");
    setValue("billingStreetAddress2", selected.line_2 || "");
    setValue("billingCity", selected.town_or_city || "");
    setValue("billingState", selected.county || "");
    setValue("billingPostalCode", zipCodeBill || "");
  };
  const handleSelectChange = (value, index) => {
    setBillingAddres({ ...billingAddres, country: value }); // Update selected country
    const isValidState = index < 3; // Check if the selected index is within the first three

    setSelectedStates(isValidState);

    if (!isValidState) {
      setValueBilling("billingStreetAddress", "");
      setValueBilling("billingStreetAddress2", "");
      setValueBilling("billingCity", "");
      setValueBilling("billingState", "");
      setValueBilling("billingPostalCode", "");
    }
  };

  // billing
  useEffect(() => {
    if (data?.addresses) {
      setAddressOptions(data.addresses);
    } else {
      setAddressOptions([]);
    }
  }, [data]);
  // billing
  useEffect(() => {
    if (dataBill?.addresses) {
      setAddressOptionsBilling(dataBill.addresses);
    } else {
      setAddressOptionsBilling([]);
    }
  }, [dataBill]);

  const onSubmitBilling = async (data) => {
    try {
      setIsLoading(isPostLoding);
      const response = await updateUserProfile({
        billing: true,
        billingcountry: data?.billingCountry,
        billingaddress_1: data?.billingStreetAddress,
        billingaddress_2: data?.billingStreetAddress2,
        billingcity: data?.billingCity,
        billingstate: data?.billingState,
        billingpostal_code: data?.billingPostalCode,
      }).unwrap();
      if (response) {
        toast.success(response?.message);
        refetch();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating the profile.");
    } finally {
      setIsLoading(isPostLoding);
    }
  };
  const onSubmitShipping = async (data) => {
    try {
      setIsLoading(isPostLoding);
      const response = await updateUserProfile({
        shipping: true,
        country: data?.country,
        address_1: data?.streetAddress,
        address_2: data?.streetAddress2,
        city: data?.city,
        state: data?.state,
        postal_code: data?.postalCode,
      }).unwrap();


      if (response) {
        toast.success(response?.message);

        refetch();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating the profile.");
    } finally {
      setIsLoading(isPostLoding);
    }
  };
  useEffect(() => { }, [activeTab, watchShipping, watchBilling]);

  // **Render Form**
  const renderForm = (register, errors, isValid, setValue, getValues) => (
    <FormControl fullWidth>
      {/* postal code  */}
      {activeTab === "shipping" && (
        <>
          <Box className=" sm:grid sm:grid-flow-row mt-6">
            <FormControl variant="standard" fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                variant="standard"
                {...registerShipping("country", { required: "Shipping Country is required" })}
                value={watchShipping("country") || getValuesShipping("country") || ""}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setValueShipping("country", selectedValue); // Update shipping form
                }}
                error={!!errorsShipping.country}
              >
                {countries?.length > 0 ? (
                  countries?.slice(0, 3).map((country, index) => (
                    <MenuItem key={index} value={country?.name || country}>
                      {country?.name || country}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No countries available
                  </MenuItem>
                )}
              </Select>
              {errorsShipping.country && <p className="text-red-500 text-sm">{errorsShipping.country.message}</p>}
            </FormControl>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <TextField
                label="Postal Code"
                variant="standard"
                fullWidth
                {...register("postalCode", { required: "Postal Code is required" })}
                error={!!errors.postalCode || error}
                helperText={errors.postalCode?.message || error?.message}
                value={watchShipping("postalCode") || ""}
                onChange={(e) => {
                  setValueShipping("postalCode", e.target.value);
                  setZipCode(e.target.value); // Synchronize with zipCode state if needed
                  setSearchClicked(false);
                }}
                InputProps={{
                  endAdornment: (
                    <>
                      {activeTab === "shipping" && watchShipping("postalCode") ? (
                        <div className="relative -top-2">
                          <button
                            type="button"
                            onClick={handleSearch}
                            disabled={!(activeTab === "shipping" && watchShipping("postalCode")?.trim()) || isLoading || error}
                            className="flex items-center justify-center px-3 py-1 bg-violet-700 text-white font-semibold text-xs rounded-md hover:bg-violet-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                          >
                            <FaSearch className={`text-white ${isLoading ? "animate-spin" : ""}`} />
                            <span className="mr-2 text-sm">{isLoading ? "SEARCH..." : "SEARCH"}</span>
                          </button>
                        </div>
                      ) : null}
                    </>
                  ),
                }}
              />

              <div className="">
                {!error && searchClicked && addressOptions.length > 0 && (
                  <div className="">
                    <FormControl fullWidth variant="standard" error={!!errors.addressSelect}>
                      <InputLabel>Select Autofill</InputLabel>
                      <Select
                        {...register("addressSelect", {
                          required: "Please select an address",
                        })} // Validation for Select
                        onChange={(e) => handleSelect(e.target.value, setValue)}
                        defaultValue=""
                      >
                        {addressOptions.map((address, index) => (
                          <MenuItem key={index} value={index}>
                            {`${address.line_1}, ${address.town_or_city}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.addressSelect && (
                        <FormHelperText>{errors.addressSelect.message}</FormHelperText> // Display error message
                      )}
                    </FormControl>
                  </div>
                )}
              </div>
            </div>

            {/* Address Dropdown - Show only after clicking Search */}

            {/* Address Fields */}
            <div className="grid grid-cols-1  gap-4 mt-4">
              <TextField
                label="Street Address 1"
                variant="standard"
                fullWidth
                {...register("streetAddress", {
                  required: "Address Line 1 is required",
                })}
                value={watchShipping("streetAddress")}
                error={!!errors.streetAddress}
                helperText={errors.streetAddress?.message}
              />
              <TextField
                variant="standard"
                label="Street Address 2"
                value={watchShipping("streetAddress2")}
                fullWidth
                {...register("streetAddress2")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <TextField
                label="City"
                variant="standard"
                fullWidth
                value={watchShipping("city")}
                {...register("city", { required: "City is required" })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField 
              variant="standard" 
              label="State" 
              fullWidth 
              value={watchShipping("state")} 

              {...register("state", {
                required: "State is required",
              })}
              error={!!errors.state}
              helperText={errors.state?.message || ""}
              
              
              />
            </div>
          </Box>
        </>
      )}

      {activeTab === "billing" && (
        <>
          <Box className="flex sm:grid sm:grid-flow-row mt-6">
            <FormControl variant="standard" fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={watchBilling("billingCountry") || ""} // Use the billingCountry value from the form state
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setValueBilling("billingCountry", selectedValue); // Update the form state
                  const selectedIndex = BillingCountrys.findIndex((country) => country.name === selectedValue);
                  if (selectedIndex !== -1) {
                    handleSelectChange(BillingCountrys[selectedIndex], selectedIndex);
                  }
                }}
              >
                {BillingCountrys.map((country, index) => (
                  <MenuItem key={index} value={country.name}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
            {selectedStates ? (
              <>
                <TextField
                  label="Postal Code"
                  // value={zipCodeBill}
                  value={watchBilling("billingPostalCode") || ""}
                  variant="standard"
                  fullWidth
                  disabled={!selectedStates}
                  {...register("billingPostalCode", {
                    required: "Postal Code is required",
                  })}
                  error={!!errors.billingPostalCode || !!errorBill}
                  helperText={errors.billingPostalCode?.message || errorBill?.message}
                  onChange={(e) => {
                    setValueBilling("billingPostalCode", e.target.value);
                    setZipCodeBill(e.target.value); // Synchronize with zipCode state if needed
                    setSearchClickedBill(false);
                  }}
                  InputProps={{
                    className: `${!selectedStates ? "cursor-not-allowed" : ""}`,
                    endAdornment: (
                      <>
                        {zipCodeBill && (
                          <div className="relative -top-2">
                            <button
                              type="button"
                              onClick={handleSearchBilling}
                              disabled={!zipCodeBill.trim() || load || errorBill || !selectedStates}
                              className="flex items-center justify-center px-3 py-1 bg-violet-700 text-white font-semibold text-xs rounded-md hover:bg-violet-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
                            >
                              <FaSearch className={`${`text-white ${load ? "animate-spin" : ""}`}`} />
                              <span className="mr-2 text-sm">{load ? "SEARCH..." : "SEARCH"}</span>
                            </button>
                          </div>
                        )}
                      </>
                    ),
                  }}
                />

                {searchClickedBill && (
                  <>
                    {!error && searchClickedBill && addressOptionsBilling.length > 0 && (
                      <div className="w-full">
                        <FormControl
                          fullWidth
                          className={`${!selectedStates ? "cursor-not-allowed" : ""}`}
                          disabled={!selectedStates}
                          variant="standard"
                          error={!!errors.addressSelect}
                        >
                          <InputLabel>Select Autofill</InputLabel>
                          <Select
                            {...register("addressSelect", {
                              required: "Please select an address",
                            })}
                            onChange={(e) => handleSelectBilling(e.target.value, setValue)}
                            defaultValue=""
                          >
                            {addressOptionsBilling.map((address, index) => (
                              <MenuItem key={index} value={index}>
                                {`${address.line_1}, ${address.town_or_city}`}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.addressSelect && <FormHelperText>{errors.addressSelect.message}</FormHelperText>}
                        </FormControl>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Postal Code"
                    value={watchBilling("billingPostalCode") || ""}
                    variant="standard"
                    fullWidth
                    error={!!errorBill || !!errors.billingPostalCode}
                    helperText={errorBill?.message || errors.billingPostalCode?.message}
                    {...register("billingPostalCode", {
                      required: "Postal Code is required",
                    })}
                  />
                </div>
              </>
            )}
          </Box>

          <div className="grid grid-cols-1  gap-4 mt-6">
            <TextField
              label="Street Address 1"
              variant="standard"
              value={watchBilling("billingStreetAddress") || ""}
              fullWidth
              {...register("billingStreetAddress", {
                required: "Address Line 1 is required",
              })}
              error={!!errors.billingStreetAddress}
              helperText={errors.billingStreetAddress?.message || ""}
            />
            {/* <TextField
            label="Address Line 2"
            variant="standard"
            fullWidth
            value={watchBilling("billingStreetAddress2") || ""}
            {...register("billingStreetAddress2")}
          // No need for error state if no validation
          /> */}

            <TextField
              variant="standard"
              label="Street Address 2"
              value={watchBilling("billingStreetAddress2")}
              fullWidth
              {...register("billingStreetAddress2")}
            />
          </div>

          <div className="grid grid-cols-1  gap-4 mt-4">
            <TextField
              label="City"
              variant="standard"
              value={watchBilling("billingCity") || ""}
              fullWidth
              {...register("billingCity", {
                required: "City is required",
              })}
              error={!!errors.billingCity}
              helperText={errors.billingCity?.message || ""}
            />
            <TextField
              label="State"
              variant="standard"
              fullWidth
              value={watchBilling("billingState") || ""}
              {...register("billingState", {
                required: "State is required",
              })}
              error={!!errors.billingState}
              helperText={errors.billingState?.message || ""}
            />
          </div>
        </>
      )}

      {/* Postal Code Search */}

      {/* Save Button */}
      <div className="mt-4 sm:max-w-20">
        <div className="text-center my-3">
          <button
            disabled={!isValid || loading || error}
            type="submit"
            className="w-full px-6 py-2 disabled:opacity-50 disabled:hover:bg-violet-700 disabled:cursor-not-allowed bg-violet-700 border border-transparent rounded-md med-font text-xs text-white uppercase tracking-widest hover:bg-violet-700 focus:bg-bg-violet-700 active:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 transition ease-in-out duration-150"
          >
            {/* Show a progress bar if loading is true */}
            {loading ? (
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#ffffff] rounded-full animate-spin"></div> {/* Spinner */}
                </div>
                <span className="opacity-0">Saving...</span>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </FormControl>
  );

  return (
    <div className="p-6 sm:bg-[#F9FAFB] sm:min-h-screen sm:rounded-md sm:shadow-md my-5 sm:me-5">
      {/* Tabs */}
      <div className="flex sm:gap-4 justify-around lg:justify-normal md:justify-normal mb-6 relative">
        {/* Shipping Tab */}
        <button
          onClick={() => tabActive("shipping")}
          className={`sm:font-bold reg-font sm:px-4 py-2 relative ${activeTab === "shipping" && "text-violet-700"} tab-text-shipping`}
        >
          Shipping Address
          {activeTab === "shipping" && <span className={`tab-shipping absolute left-0 bottom-0 h-[4px] bg-violet-700 w-full`} />}
        </button>

        {/* Billing Tab */}
        <button
          onClick={() => tabActive("billing")}
          className={`sm:font-bold reg-font sm:px-4 py-2 relative ${activeTab === "billing" && "text-violet-700"} tab-text-billing`}
        >
          Billing Address
          {activeTab === "billing" && <span className={`tab-billing absolute left-0 bottom-0 h-[4px] bg-violet-700 w-full`} />}
        </button>
      </div>

      {/* Forms */}
      <div className="bg-white p-4 rounded-md">
        {activeTab === "shipping" ? (
          <>
            <div className=" my-4 w-full">
              <h1 className="md:text-2xl text-2xl mb-2 font-semibold">Shipping Information</h1>
              <p className="reg-font text-gray-600 text-left text-sm xl:w-3/4 mt-2">Update your shipping information</p>
            </div>
            <form onSubmit={handleSubmitShipping(onSubmitShipping)}>
              {renderForm(registerShipping, errorsShipping, isValidShipping, setValueShipping, getValuesShipping)}
            </form>
          </>
        ) : (
          <>
            <div className=" my-4  w-full">
              <h1 className="md:text-2xl text-2xl mb-2 font-semibold">Billing Information</h1>
              <p className="reg-font text-gray-600 text-left text-sm xl:w-3/4 mt-2">Update your billing information</p>
            </div>
            <form onSubmit={handleSubmitBilling(onSubmitBilling)}>
              {renderForm(registerBilling, errorsBilling, isValidBilling, setValueBilling, getValuesBilling)}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAddress;
