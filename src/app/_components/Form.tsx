import { FormLabel, FormField, Form, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';

const FormDemo = () => {
  const onSubmit = (data) => {
    console.log('data', data.file_sql)
  }
  const handleUpload = (e: any) => {
    const fileReader = new FileReader();
    const { files } = e.target;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = e => {
      const content = e.target?.result;
      content && console.log(JSON.parse(content as string));

    };
  }
  const methods = useForm()
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <input type="file" onChange={handleUpload} />
        <FormItem>
          <FormLabel htmlFor="file_sql">Upload SQL file</FormLabel>
          <FormField control={methods.control} name='file_sql' render={({ field }) => <Input type='file' accept='*' {...field} />}></FormField>

        </FormItem>
        <FormItem>
          <FormLabel htmlFor="file_sql">Upload DLL file</FormLabel>
          <Input id="file_dll" type='file' accept='*' name='file_sql' />
        </FormItem>
        <Input type='submit' value="Submit" />
      </form>
    </Form>
  )

};

export default FormDemo;