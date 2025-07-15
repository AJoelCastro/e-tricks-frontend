import { FormProvider as ReactHookFormProvider } from 'react-hook-form';

// ==============================================================

// ==============================================================

export default function FormProvider({
  children,
  methods,
  onSubmit
}) {
  return <ReactHookFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </ReactHookFormProvider>;
}