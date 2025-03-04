"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import React, { useActionState, useState } from "react";
import SubmitButton from "./SubmitButton";
import { createInvoice } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "../utils/zodSchemas";
import ErrorMessage from "./ErrorMessage";
import { Currency, formatCurrency, formatDate } from "../utils/formatCurrency";

interface CreateInvoiceProps {
  data: {
    firstName: string | null;
    lastName: string | null;
    address: string | null;
    email: string;
  } | null;
}

export default function CreateInvoice({ data }: CreateInvoiceProps) {
  const [lastResult, action] = useActionState(createInvoice, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState("");

  const [quantity, setQuantity] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const calculatedTotal = (Number(rate) || 0) * (Number(quantity) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          {/**Hidden input for Date calendar */}
          <Input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />
          <Input
            type="hidden"
            name={fields.total.name}
            value={calculatedTotal}
          />
          {/**Draft */}
          <div className="flex flex-col gap-2 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="Test 123"
              />
            </div>
            <ErrorMessage message={fields.invoiceName.errors} />
          </div>

          {/**Invoice No. and Currency */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
                  placeholder="5"
                  className="rounded-l-none"
                />
              </div>
              <ErrorMessage message={fields.invoiceNumber.errors} />
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value: Currency) => setCurrency(value)}
                defaultValue={currency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                  <SelectItem value="SLSH">Somali Shilling-- SLSH</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage message={fields.currency.errors} />
            </div>
          </div>

          {/**Address from and to */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>From:</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  defaultValue={data?.firstName + " " + data?.lastName}
                  placeholder="Your Name"
                />
                <ErrorMessage message={fields.fromName.errors} />
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={data?.email}
                  placeholder="Your Email"
                />
                <ErrorMessage message={fields.fromEmail.errors} />
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={data?.address as string}
                  placeholder="Your Address"
                />
                <ErrorMessage message={fields.fromAddress.errors} />
              </div>
            </div>
            <div>
              <Label>To:</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={fields.clientName.initialValue}
                  placeholder="Client Name"
                />
                <ErrorMessage message={fields.clientName.errors} />
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder="Client Email"
                />
                <ErrorMessage message={fields.clientEmail.errors} />
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
                  placeholder="Client Address"
                />
                <ErrorMessage message={fields.clientAddress.errors} />
              </div>
            </div>
          </div>

          {/** Date and Due */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>

              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[280px] text-left justify-start"
                    >
                      <CalendarIcon />
                      {selectedDate ? (
                        formatDate(selectedDate)
                      ) : (
                        <p>Pick a date</p>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date || new Date())}
                      mode="single"
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <ErrorMessage message={fields.date.errors} />
              </div>
            </div>

            <div>
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Reciept</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage message={fields.dueDate.errors} />
            </div>
          </div>

          {/**Invoice fields */}
          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <span className="col-span-6">Description</span>
              <span className="col-span-2">Quantity</span>
              <span className="col-span-2">Rate</span>
              <span className="col-span-2">Amount</span>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                />
                <ErrorMessage message={fields.invoiceItemDescription.errors} />
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <ErrorMessage message={fields.invoiceItemQuantity.errors} />
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <ErrorMessage message={fields.invoiceItemRate.errors} />
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.total.name}
                  key={fields.total.key}
                  value={formatCurrency({
                    amount: calculatedTotal,
                    currency,
                  })}
                  disabled
                />
                <ErrorMessage message={fields.total.errors} />
              </div>
            </div>
          </div>

          {/**Total and subtotal */}
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: calculatedTotal,
                    currency,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                    amount: calculatedTotal,
                    currency,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/**Note */}
          <div className="mb-6">
            <div className="pb-1">
              <Label className="">Note</Label>
            </div>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder="Add your Note/s right here..."
            />
            <ErrorMessage message={fields.note.errors} />
          </div>

          {/**Submit Button */}
          <div className="flex items-center justify-end">
            <div>
              <SubmitButton text="Send invoice to client" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
