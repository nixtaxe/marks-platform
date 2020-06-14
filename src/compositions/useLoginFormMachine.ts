import useFormMachine from './useFormMachine'

export default function useLoginFormMachine (machine: any) {
  return {
    ...useFormMachine(machine),
    usernameRules: machine.state.context.rules.usernameRules,
    passwordRules: machine.state.context.rules.passwordRules,
  }
}
