"use client";

import { RoleDto, UpdateRoleCommand, CreateRoleCommand } from "@/api/generated/model";
import {
  usePutApiV1RoleId,
  usePostApiV1Role,
  getGetApiV1RoleQueryKey,
} from "@/api/generated/role/role";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { Loader2, Save, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface RoleFormModalProps {
  role: RoleDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Role name is required" }),
});

export const RoleFormModal = ({ role, isOpen, onClose }: RoleFormModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleError } = useErrorHandler();

  const isEditMode = role !== null;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && role?.name) {
        form.setValue("name", role.name);
      }
    }
  }, [isOpen, isEditMode, role]);

  const commonMutationOptions = {
    onSuccess: () => {
      toast.success(isEditMode ? "Role updated successfully" : "Role created successfully");
      queryClient.invalidateQueries({ queryKey: getGetApiV1RoleQueryKey() });
      router.refresh();
      onClose();
    },
    onError: (error: unknown) => {
      handleError(error);
      onClose();
    },
  };

  const updateRoleMutation = usePutApiV1RoleId({
    mutation: commonMutationOptions,
  });

  const createRoleMutation = usePostApiV1Role({
    mutation: commonMutationOptions,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEditMode) {
      if (!role?.id) return;
      const command: UpdateRoleCommand = { id: role.id, name: data.name };
      updateRoleMutation.mutate({ id: role.id, data: command });
    } else {
      const command: CreateRoleCommand = { name: data.name };
      createRoleMutation.mutate({ data: command });
    }
  };

  const mutation = isEditMode ? updateRoleMutation : createRoleMutation;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the role name." : "Enter a name for the new role."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Role Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-3">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
