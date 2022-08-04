package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"
)

const noteFrontMatterFmt = `---
title: "%s | %s"
---`

func walkAllFilesInDir(dir string, cb func(dir, path string) error) error {
	return filepath.Walk(dir, func(path string, info os.FileInfo, e error) error {
		if e != nil {
			return e
		}

		// skip hidden directories
		if info.Name()[0] == '.' {
			return nil
		}

		if info.Mode().IsRegular() {
			return cb(dir, path)
		}
		return nil
	})
}

func lintPathForFrontmatter(base string, filepath string) error {
	contents, err := ioutil.ReadFile(filepath)
	if err != nil {
		panic(err)
	}

	if strings.HasPrefix(string(contents), "---") {
		return nil
	}

	dir, filename := path.Split(filepath)

	formattedDir := strings.ReplaceAll(dir, base, "")
	formattedFilename := strings.ReplaceAll(filename, ".md", "")
	formattedFrontmatter := fmt.Sprintf(noteFrontMatterFmt, formattedDir, formattedFilename)

	frontmatterAndContents := []byte(formattedFrontmatter + "\n\n" + string(contents))

	ioutil.WriteFile(filepath, frontmatterAndContents, 0600)
	return nil
}

func main() {
	absPath, err := filepath.Abs("./content")
	if err != nil {
		panic(err)
	}
	walkAllFilesInDir(absPath, lintPathForFrontmatter)
}
