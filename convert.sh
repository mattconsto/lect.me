#!/bin/bash

soffice --convert-to pdf input.doc intermediate.pdf --headless
pdftk my_multi_page.pdf burst output page_%02d.pdf dont_ask