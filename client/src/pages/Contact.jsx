import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BsPerson } from "react-icons/bs";
import { TfiEmail } from "react-icons/tfi";
import { BsChatRightText } from "react-icons/bs";
import { BiSolidPhone } from "react-icons/bi";
import { Card } from "@/components/ui/card";
import { FaLocationDot } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";
import PageHeader from "@/components/ui/PageHeader";
import { useState } from "react";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultLayout from "@/components/layout/DefaultLayout";
import axios from "axios";
import { API_ORIGIN } from "@/config/apiBase";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form data being sent:", formData);
      const response = await fetch(`${API_ORIGIN}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("Thanks! Your note is on its way to our team.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("We could not deliver that message—please try again shortly.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Something went wrong on our side. Please retry in a moment.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <DefaultLayout>
      <PageHeader title="Contact our learning team" breadcrumb="Contact" />

      <div className="flex flex-wrap justify-center gap-8 p-4 lg:p-8">
        {/* Left Section: message form */}
        <Card className="w-full lg:w-[60%] bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Send us a message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Your Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                  <BsPerson className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Your Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Your Email"
                    required
                  />
                  <TfiEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Subject Select */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1"
              >
                Select Subject
              </label>
              <Select
                className="w-full"
                id="subject"
                name="subject"
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subject: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Topic</SelectLabel>
                    <SelectItem value="General Inquiry">
                      General question
                    </SelectItem>
                    <SelectItem value="support">Technical support</SelectItem>
                    <SelectItem value="feedback">Product feedback</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Message
              </label>
              <div className="relative">
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                />
                <BsChatRightText className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
              // onClick={(e) => handleSubmit(e, "Submit")}
              disabled={loading}
            >
              {loading ? "Sending…" : "Send message"}
              {/* Submit Message */}
            </Button>
          </form>
          {status && <p className="text-center  mt-4">{status}</p>}
        </Card>

        {/* Right Section: studio details */}
        <Card className="w-full lg:w-[35%] bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Studio & contact details</h2>
          <ul className="space-y-6">
            <li className="flex items-center gap-4">
              <Card className="shadow-md rounded-lg p-3">
                <BiSolidPhone className="text-orange-500 text-xl" />
              </Card>
              <div>
                <p className="font-medium text-sm sm:text-base lg:text-lg">
                  Phone & email
                </p>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  (123) 123-1234
                </p>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  smartflowtechofficial@gmail.com
                </p>
              </div>
            </li>
            <li className="flex items-center gap-4 border-t pt-4">
              <Card className="shadow-md rounded-lg p-3">
                <FaLocationDot className="text-orange-500 text-xl" />
              </Card>
              <div>
                <p className="font-medium text-sm sm:text-base lg:text-lg">
                  Headquarters
                </p>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  1234 ABC Road, Karachi, Pakistan
                </p>
              </div>
            </li>
            <li className="flex items-center gap-4 border-t pt-4">
              <Card className="shadow-md rounded-lg p-3">
                <BsClockFill className="text-orange-500 text-xl" />
              </Card>
              <div>
                <p className="font-medium text-sm sm:text-base lg:text-lg">
                  Support hours
                </p>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  Monday - Friday: 09:00 - 20:00
                </p>
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  Sunday & Saturday: 10:00 - 22:00
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default ContactUs;
