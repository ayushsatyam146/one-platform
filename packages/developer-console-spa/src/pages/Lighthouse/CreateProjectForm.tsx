import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import { Dispatch, SetStateAction } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { createLightHouseProjects } from 'common/services/lighthouse';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type CreateProjectFormValues = {
  projectName: string;
  repoUrl: string;
  baseBranch: string;
};

const projectSchema = yup.object().shape({
  projectName: yup.string().label('Project Name').trim().required(),
  repoUrl: yup.string().label('Repository URL').url().trim(),
  baseBranch: yup.string().label('Base Branch').trim(),
});

type CreateProjectProps = {
  setActiveTabKey: Dispatch<SetStateAction<number>>;
  setSelectedProject: Dispatch<SetStateAction<Lighthouse.Project>>;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
};

const CreateProjectForm = (props: CreateProjectProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    mode: 'onBlur',
    resolver: yupResolver(projectSchema),
  });

  const createProject = async (data: CreateProjectFormValues) => {
    let project = {
      name: data.projectName,
      baseBranch: data.baseBranch,
      externalUrl: data.repoUrl,
    };
    try {
      const res = await createLightHouseProjects(project);
      props.setSelectedProject(res);
      props.setShowConfirmation(true);
    } catch {
      window.OpNotification?.danger({
        subject: 'Failed to save SPA configuration!',
      });
    }
  };
  return (
    <Form
      onSubmit={handleSubmit(createProject)}
      className="lighthouse-projectForm--marginTop"
    >
      <FormGroup
        isRequired
        fieldId=""
        helperTextInvalid="Project Name is mandatory"
        helperTextInvalidIcon={
          <ion-icon name="alert-circle-outline"></ion-icon>
        }
        validated={errors.projectName ? 'error' : 'default'}
        label="Project Name"
      >
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              id="project-name"
              aria-describedby="projectName"
              validated={errors.projectName ? 'error' : 'default'}
            />
          )}
          name="projectName"
          control={control}
          rules={{ required: true }}
        />
      </FormGroup>
      <FormGroup fieldId="" label="Repository URL">
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              id="project-name"
              aria-describedby="projectName"
            />
          )}
          name="repoUrl"
          control={control}
        />
      </FormGroup>
      <FormGroup fieldId="" label="Base Branch">
        <Controller
          render={({ field }) => (
            <TextInput
              {...field}
              type="text"
              id="project-name"
              aria-describedby="projectName"
            />
          )}
          name="baseBranch"
          control={control}
        />
      </FormGroup>
      <FormGroup fieldId="">
        <Flex>
          <FlexItem align={{ default: 'alignRight' }}>
            <Button
              type="submit"
              isDisabled={isSubmitting || !isValid}
              spinnerAriaValueText={isSubmitting ? 'Loading' : undefined}
              isLoading={isSubmitting}
              variant="primary"
            >
              Create Project
            </Button>
          </FlexItem>
        </Flex>
      </FormGroup>
    </Form>
  );
};

export default CreateProjectForm;
