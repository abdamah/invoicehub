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
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Invoice } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { editInvoice } from "../actions";
import { Currency, formatCurrency, formatDate } from "../utils/formatCurrency";
import { invoiceSchema } from "../utils/zodSchemas";
import ErrorMessage from "./ErrorMessage";
import SubmitButton from "./SubmitButton";

interface EditInvoiceProps {
  data: Invoice;
}

export default function EditInvoice({ data }: EditInvoiceProps) {
  const [lastResult, action] = useActionState(editInvoice, undefined);

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

  const [selectedDate, setSelectedDate] = useState(data.date);
  const [rate, setRate] = useState(data.invoiceItemRate.toString());

  const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
  const [currency, setCurrency] = useState<Currency>(data.currency as Currency);

  const calculatedTotal = (Number(rate) || 0) * (Number(quantity) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          {/**Id input for update */}
          <Input type="hidden" name="id" value={data.id} />

          {/**Hidden input for Date calendar */}
          <Input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />

          {/**For total input */}
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
                defaultValue={data.invoiceName}
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
                  defaultValue={data.invoiceNumber}
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
                  defaultValue={data?.fromName}
                  placeholder="Your Name"
                />
                <ErrorMessage message={fields.fromName.errors} />
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={data?.fromEmail}
                  placeholder="Your Email"
                />
                <ErrorMessage message={fields.fromEmail.errors} />
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={data.fromAddress}
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
                  defaultValue={data.clientName}
                  placeholder="Client Name"
                />
                <ErrorMessage message={fields.clientName.errors} />
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={data.clientEmail}
                  placeholder="Client Email"
                />
                <ErrorMessage message={fields.clientEmail.errors} />
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={data.clientAddress}
                  placeholder="Client Address"
                />
                <ErrorMessage message={fields.clientAddress.errors} />
              </div>
            </div>
          </div>

          {/** Date and Due */}
          <div className="grid grid-cols-2 md:grid-cols-12  gap-4 mb-6">
            <div className="col-span-6">
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

            <div className="col-span-6 grid grid-cols-2 md:grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label>Invoice Due</Label>
                <Select
                  name={fields.dueDate.name}
                  key={fields.dueDate.key}
                  defaultValue={data?.dueDate.toString()}
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
              <div className="col-span-6">
                <Label>Status</Label>
                <Select
                  name={fields.status.name}
                  key={fields.status.key}
                  defaultValue={data?.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="PAID">PAID</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage message={fields.dueDate.errors} />
              </div>
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
                  defaultValue={data?.invoiceItemDescription}
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
              defaultValue={data?.note ?? undefined}
              placeholder="Add your Note/s right here..."
            />
            <ErrorMessage message={fields.note.errors} />
          </div>

          {/**Submit Button */}
          <div className="flex items-center justify-end">
            <div>
              <SubmitButton text="Update Invoice" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
