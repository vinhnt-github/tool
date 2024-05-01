import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATA_TYPE, VALUE_TYPE } from "@/lib/const";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type EditModalProps = {
  item: any;
  onEdit: (data: any) => void;
  openEditModal: boolean;
  setOpenEditModal: (open: boolean) => void;
};
export function EditModal({
  item,
  openEditModal,
  setOpenEditModal,
  onEdit,
}: EditModalProps) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      id: item.id ?? "",
      columns: item?.data?.columns
        ? [...item.data.columns]
        : [
            {
              fieldName: "",
              valueType: "",
              dataType: "",
              value: "",
              length: 0,
            },
          ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = (data: any) => {
    console.log("data", data);
    onEdit?.(data);
  };

  return (
    <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Table</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[800px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-5 items-center gap-4"
              >
                <Input readOnly {...register(`columns.${index}.fieldName`)} />
                <Controller
                  name={`columns.${index}.valueType`}
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                  }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {VALUE_TYPE.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Controller
                  name={`columns.${index}.dataType`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {DATA_TYPE.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Input {...register(`columns.${index}.value`)} />
                <Input {...register(`columns.${index}.length`)} />
              </div>
            ))}
          </div>
          <div className="w-full flex justify-end gap-4">
            <Button type="submit" className="text-right">
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
