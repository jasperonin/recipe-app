"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
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
  image: string;
  time: number;
  description: string;
  vegan: boolean;
  id: string;
}

async function fetchRecipe(): Promise<Recipe[]> {
  const result = await fetch("http://localhost:3001/recipes");
  if (!result.ok) {
    throw new Error("Failed to fetch recipes");
  }
  return result.json();
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<string>(""); // State for search query
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [alertVisible, setAlertVisible] = useState(false); // Alert state
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    title: "",
    image: "",
    time: 0,
    description: "",
    vegan: false,
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

  const handleAddRecipe = () => {
    const recipeToAdd: Recipe = {
      ...newRecipe,
      id: String(recipes.length + 1), // Generate a simple unique ID
      time: Number(newRecipe.time), // Ensure time is a number
    } as Recipe;

    setRecipes((prevRecipes) => [...prevRecipes, recipeToAdd]);

    // Clear input fields after submission
    setNewRecipe({
      title: "",
      image: "",
      time: 0,
      description: "",
      vegan: false,
    });
    setDialogOpen(false);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 1000);
  };

  if (loading) {
    return <p className="text-center my-10">Loading recipes...</p>;
  }

  return (
    <main>
      <div className="text-5xl my-5 text-center">Recipe App</div>
      {alertVisible && (
        <div className="mx-auto my-4 max-w-md">
          <Alert>
            <AlertTitle>Recipe Added!</AlertTitle>
            <AlertDescription>
              Your recipe has been successfully added.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="max-w-xl mx-auto mb-5 flex space-x-5">
        <Input
          type="text"
          placeholder="Search for a recipe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Recipe</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
              <DialogDescription>
                Fill out the details of the recipe.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Recipe Title
                </Label>
                <Input
                  id="title"
                  defaultValue={newRecipe.title}
                  className="col-span-3"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, title: e.target.value })
                  }
                  placeholder="Enter Recipe Title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <Input
                  id="image"
                  defaultValue={newRecipe.image}
                  className="col-span-3"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, image: e.target.value })
                  }
                  placeholder="Image Path"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  defaultValue={newRecipe.time}
                  className="col-span-3"
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, time: Number(e.target.value) })
                  }
                  placeholder="Time to prepare in minutes"
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
                <Label htmlFor="vegan" className="text-right">
                  Vegan
                </Label>
                <Input
                  id="vegan"
                  type="checkbox"
                  checked={newRecipe.vegan}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, vegan: e.target.checked })
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-5 sm:mx-10 lg:mx-60 my-10 gap-8">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="flex flex-col justify-between">
            <CardHeader className="flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage
                  src={`/img/${recipe.image}`}
                  className="h-5 w-5 sm:h-25 sm:w-25 md:h-25 md:w-25 lg:h-60 lg:w-72 rounded-3xl mx-auto"
                />
                <AvatarFallback>{recipe.title.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recipe.title}</CardTitle>
                <CardDescription>
                  {recipe.time} mins to prepare.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button>View Recipe</Button>
              {recipe.vegan && <Badge variant="default">Vegan!</Badge>}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
