import type { QwikChangeEvent } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { routeLoader$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { formAction$, getValues, useForm, zodForm$ } from "@modular-forms/qwik";
import LucideRefreshCcw from "~/components/icons/lucide-refresh-ccw";
import LucideTrash from "~/components/icons/lucide-trash";
import { AnchorButton, Button } from "~/components/ui/buttons";
import { Card } from "~/components/ui/card";
import type { CrudCookies } from "~/components/ui/crud";
import { Crud } from "~/components/ui/crud";
import {
  Checkbox,
  Datepicker,
  Input,
  SearchInput,
  Select,
} from "~/components/ui/form";
import { TableCell, TableRow } from "~/components/ui/table";
import { Gradient, H1, H2, H3, H5 } from "~/components/ui/typography";
import { Router } from "~/lib/router";

enum PlaygroundEnum {
  First = "First",
  Second = "Second",
}

export const Playground_Schema = z.object({
  string: z.string().nullable(),
  stringRequired: z.string().min(1),
  number: z.coerce.number().nullable(),
  numberRequired: z.coerce.number(),
  select: z.nativeEnum(PlaygroundEnum).nullable(), // TODO: Add Multiple selector: https://modularforms.dev/qwik/guides/special-inputs
  selectRequired: z.nativeEnum(PlaygroundEnum),
  boolean: z.coerce.boolean().nullable(),
  booleanRequired: z.coerce.boolean(),
  date: z.coerce.date().nullable(),
  dateRequired: z.coerce.date(),
  datetime: z.coerce.date().nullable(),
  datetimeRequired: z.coerce.date(),
});
type Playground_Type = z.infer<typeof Playground_Schema>;

export const usePlayground_FormLoader = routeLoader$<
  InitialValues<Playground_Type>
>(() => ({
  string: null,
  stringRequired: "foobar",
  number: null,
  numberRequired: 33,
  select: null,
  selectRequired: PlaygroundEnum.First,
  boolean: null,
  booleanRequired: true,
  date: null,
  dateRequired: new Date(),
  datetime: null,
  datetimeRequired: new Date(),
}));

export const usePlayground_FormAction = formAction$<Playground_Type>(
  async (input, event) => {
    console.log(`🚀  Input received:`, input);
    console.log("date", new Date(input.dateRequired).toISOString()); // TODO: Fix date type
    console.log("datetime", new Date(input.datetimeRequired).toISOString()); // TODO: Fix datetime type
    // throw new FormError<Playground_Type>({
    //   string: "Example form error",
    // });
    return event.fail(491, { message: "Example event error" });
  },
  zodForm$(Playground_Schema),
);

export default component$(() => {
  const [Playground_Form, { Form, Field }] = useForm<Playground_Type>({
    loader: usePlayground_FormLoader(),
    action: usePlayground_FormAction(),
    validate: zodForm$(Playground_Schema),
  });

  const crudItems: {
    count: number;
    items: { id: string; text: string }[];
    crudCookies: CrudCookies;
  } = {
    count: 4,
    items: [
      { id: "1", text: "item1" },
      { id: "2", text: "item2" },
      { id: "3", text: "item3" },
      { id: "4", text: "item4" },
    ],
    crudCookies: {
      limit: 3,
      offset: 0,
      orderBy: "id,asc",
      search: "",
    },
  };

  return (
    <section class="container space-y-4 py-4">
      <Card class="mx-auto max-w-3xl p-8">
        <H1>Playground form</H1>
        <Form>
          <Field name="string">
            {(field, props) => (
              <Input
                {...props}
                {...field}
                label="String"
                description="Example description..."
                type="text"
              />
            )}
          </Field>
          <Field name="stringRequired">
            {(field, props) => (
              <Input
                {...props}
                {...field}
                label="String required"
                type="text"
                required
              />
            )}
          </Field>
          <Field name="number" type="number">
            {(field, props) => (
              <Input {...props} {...field} label="Number" type="number" />
            )}
          </Field>
          <Field name="numberRequired" type="number">
            {(field, props) => (
              <Input
                {...props}
                {...field}
                label="Number required"
                type="number"
                required
              />
            )}
          </Field>
          <Field name="select">
            {(field, props) => (
              <Select
                {...props}
                {...field}
                label="Select"
                value={field.value || undefined}
                options={[
                  { label: "", value: "" },
                  { label: "First", value: PlaygroundEnum.First },
                  { label: "Second", value: PlaygroundEnum.Second },
                ]}
              />
            )}
          </Field>
          <Field name="selectRequired">
            {(field, props) => (
              <Select
                {...props}
                {...field}
                label="Select required"
                required
                options={[
                  { label: "First", value: PlaygroundEnum.First },
                  { label: "Second", value: PlaygroundEnum.Second },
                ]}
              />
            )}
          </Field>
          <Field name="boolean" type="boolean">
            {(field, props) => (
              <Checkbox
                {...props}
                {...field}
                value={field.value || undefined}
                label="Boolean"
                description="Example checkbox description..."
              />
            )}
          </Field>
          <Field name="booleanRequired" type="boolean">
            {(field, props) => (
              <Checkbox
                {...props}
                {...field}
                label="Boolean required"
                required
              />
            )}
          </Field>
          <Field name="date" type="Date">
            {(field, props) => (
              <Datepicker
                {...props}
                {...field}
                value={field.value || undefined}
                type="date"
                label="Date"
              />
            )}
          </Field>
          <Field name="dateRequired" type="Date">
            {(field, props) => (
              <Datepicker
                {...props}
                {...field}
                type="date"
                label="Date required"
                required
              />
            )}
          </Field>
          <Field name="datetime" type="Date">
            {(field, props) => (
              <Datepicker
                {...props}
                {...field}
                value={field.value || undefined}
                type="datetime-local"
                label="Datetime required"
                required
                onChange$={(event: QwikChangeEvent<HTMLInputElement>) => {
                  const isoDate = new Date(`${event.target.value}:00.000Z`);
                  isoDate.setMinutes(
                    isoDate.getMinutes() + isoDate.getTimezoneOffset(),
                  );
                  field.value = isoDate;
                }}
              />
            )}
          </Field>
          <Field name="datetimeRequired" type="Date">
            {(field, props) => (
              <Datepicker
                {...props}
                {...field}
                type="datetime-local"
                label="Datetime required"
                required
                onChange$={(event: QwikChangeEvent<HTMLInputElement>) => {
                  const isoDate = new Date(`${event.target.value}:00.000Z`);
                  isoDate.setMinutes(
                    isoDate.getMinutes() + isoDate.getTimezoneOffset(),
                  );
                  field.value = isoDate;
                }}
              />
            )}
          </Field>
          {Playground_Form.response.message && (
            <p class="text-red-500">{Playground_Form.response.message}</p>
          )}
          <Button
            class="mt-2"
            size="wide"
            type="submit"
            aria-label="Send button"
          >
            Send
          </Button>
        </Form>
        <Card class="mt-4 dark:text-white">
          {JSON.stringify(getValues(Playground_Form), null, 4)}
        </Card>
      </Card>
      <Card class="mx-auto max-w-3xl p-6">
        <H1>Components</H1>
        <SearchInput placeholder="Search input..." />
        <div class="flex flex-wrap gap-4 pt-6">
          <Button>Button</Button>
          <Button variant="outline">Button</Button>
          <Button variant="ghost">Button</Button>
        </div>
        <div class="flex flex-wrap gap-4 pt-4">
          <Button color="danger">Button</Button>
          <Button color="danger" variant="outline">
            Button
          </Button>
          <Button color="danger" variant="ghost">
            Button
          </Button>
        </div>
        <div class="flex flex-wrap gap-4 pt-6">
          <Button size="wide">Button</Button>
          <Button variant="outline" size="wide">
            Button
          </Button>
          <Button variant="ghost" size="wide">
            Button
          </Button>
        </div>
        <div class="flex flex-wrap gap-4 pt-6">
          <Button color="danger" size="wide">
            Button
          </Button>
          <Button color="danger" variant="outline" size="wide">
            Button
          </Button>
          <Button color="danger" variant="ghost" size="wide">
            Button
          </Button>
        </div>
        <div class="flex flex-wrap gap-4 pt-6">
          <Button disabled>Disabled</Button>
          <Button>
            <LucideRefreshCcw class="h-4 w-4" />
          </Button>
          <Button>
            <LucideRefreshCcw class="h-4 w-4" />
            Text with Icon
          </Button>
          <AnchorButton href="#">Anchor</AnchorButton>
          <Button class="bg-gradient-to-tl from-blue-600 to-violet-600 dark:text-white">
            Styled
          </Button>
        </div>
        <div class="flex flex-col flex-wrap gap-4 pt-6">
          <Button class="grow">Grow</Button>
          <Button class="grow">
            {" "}
            <LucideRefreshCcw class="h-4 w-4" />
            Grow with Icon
          </Button>
        </div>
        <div class="pt-12">
          <H1>H1 title</H1>
          <H2>H2 title</H2>
          <H3>H3 title</H3>
          <H5>H5 subtitle</H5>
          <Gradient>Gradient</Gradient>
        </div>
      </Card>
      <Card class="mx-auto max-w-3xl overflow-scroll p-6">
        <Crud
          title="Crud Title"
          url={Router.playground}
          headers={[
            { label: "ID #", columnName: "id" },
            { label: "Text", columnName: "text" },
            {},
          ]}
          items={crudItems.items}
          count={crudItems.count}
          createButton="Create Button"
          crudCookies={crudItems.crudCookies}
          searchInput={true}
        >
          {crudItems.items.map((e) => (
            <TableRow
              key={e.id}
              onClick$={async () => {
                console.log("Clicked", e);
              }}
            >
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.text}</TableCell>
              <TableCell>
                <Button
                  color="danger"
                  onClick$={() => {
                    console.log("Deleted", e);
                  }}
                >
                  <LucideTrash class="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Crud>
      </Card>
    </section>
  );
});
