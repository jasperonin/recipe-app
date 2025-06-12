"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialogDemo } from "./delete_button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Recipe {
  title: string;
  description: string;
  important: boolean;
  id: string;
  answer: string;
}

async function fetchRecipe(): Promise<Recipe[]> {
const result = await fetch("https://jasperonin.github.io/recipe-app/db.json");
  if (!result.ok) {
    throw new Error("Failed to fetch recipes");
  }
  const data = await result.json();
  
  if (!Array.isArray(data.recipes)) {
    console.error("Invalid data structure:", data);
    throw new Error("Expected `recipes` to be an array");
  }

  return data.recipes;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string>(""); // State for search query
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [alertVisible, setAlertVisible] = useState(false); // Alert state
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    title: "",
    description: "",
    important: false,
    answer: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchRecipe();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRecipes(
      recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, recipes]);

  const handleDelete = (id: string) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  const handleAddRecipe = () => {
    const recipeToAdd: Recipe = {
      ...newRecipe,
      id: String(recipes.length + 1),
    } as Recipe;

    setRecipes((prevRecipes) => [...prevRecipes, recipeToAdd]);

    // Clear input fields after submission
    setNewRecipe({
      title: "",
      description: "",
      important: false,
    });
    setDialogOpen(false);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 1000);
  };

  if (loading) {
    return <p className="text-center my-10">Loading question and answers...</p>;
  }

  return (
    <main>
      <div className="text-4xl my-5 text-center">Support Response Submission</div>
      {alertVisible && (
        <div className="mx-auto my-4 max-w-md">
          <Alert>
            <AlertTitle>Added!</AlertTitle>
            <AlertDescription>
              Post has been added successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="max-w-xl mx-auto mb-5 flex space-x-5">
        <Input
          type="text"
          placeholder="Search here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Add a Post</Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
              <DialogDescription>Fill here</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  defaultValue={newRecipe.title}
                  className="col-span-3"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, title: e.target.value })
                  }
                  placeholder="Enter Title"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  defaultValue={newRecipe.description}
                  className="col-span-3"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, description: e.target.value })
                  }
                  placeholder="Recipe Description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="important" className="text-right">
                  important
                </Label>
                <Input
                  id="important"
                  type="checkbox"
                  checked={newRecipe.important}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, important: e.target.checked })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddRecipe}>Add Recipe</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-5 sm:mx-10 lg:mx-5 my-1 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage className="h-5 w-5 sm:h-25 sm:w-25 md:h-25 md:w-25 lg:h-60 lg:w-72 rounded-3xl mx-auto" />
                <AvatarFallback>{recipe.title.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recipe.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-justify">{recipe.description}</p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="my-2 mx-auto">
                    Answer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>My Answer</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="answer" className="sr-only">
                        Answer
                      </Label>
                      <p
                        id="answer"
                        className="text-justify"
                        dangerouslySetInnerHTML={{ __html: recipe.answer }}
                      ></p>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* <Button variant={"destructive"} onClick={()=>handleDelete(recipe.id)}>Delete Recipe</Button> */}
              <AlertDialogDemo onDelete={handleDelete} id={recipe.id} />
              {recipe.important && <Badge variant="default">Important!</Badge>}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
